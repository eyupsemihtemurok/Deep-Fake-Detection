import torch
import cv2
import os
import numpy as np
from pathlib import Path
from torchvision import transforms
from model import get_model
import time

class DeepfakeTester:
    """Eğitilmiş modeli test etmek için sınıf"""
    
    def __init__(self, model_path, device):
        self.device = device
        self.model = get_model(device, pretrained=False)
        self.model.load_state_dict(torch.load(model_path, map_location=device, weights_only=False))
        self.model.eval()
        
        # Transform
        self.transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                               std=[0.229, 0.224, 0.225])
        ])
        
        # İstatistikler
        self.predictions = []
        self.inference_times = []
        
        print("✅ Model yüklendi")
    
    def predict_image(self, image_path, true_label=None):
        """Tek bir frame'i test et"""
        try:
            image = cv2.imread(str(image_path))
            if image is None:
                return None, None, None, None
            
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            image_tensor = self.transform(image).unsqueeze(0).to(self.device)
            
            start_time = time.time()
            with torch.no_grad():
                outputs = self.model(image_tensor)
                probabilities = torch.softmax(outputs, dim=1)
                prediction = torch.argmax(probabilities, dim=1).item()
                confidence = probabilities[0][prediction].item() * 100
                fake_prob = probabilities[0][1].item() * 100
                real_prob = probabilities[0][0].item() * 100
            inference_time = (time.time() - start_time) * 1000  # ms cinsinden
            
            self.inference_times.append(inference_time)
            
            # Tahmin kaydet (istatistik için)
            if true_label is not None:
                is_correct = (prediction == true_label)
                self.predictions.append({
                    'prediction': prediction,
                    'true_label': true_label,
                    'confidence': confidence,
                    'fake_prob': fake_prob,
                    'real_prob': real_prob,
                    'is_correct': is_correct
                })
            
            label = "🔴 FAKE" if prediction == 1 else "🟢 REAL"
            return label, confidence, fake_prob, real_prob
        except Exception as e:
            print(f"❌ Hata: {e}")
            return None, None, None, None
    
    def get_stats(self):
        """İstatistikleri hesapla"""
        if not self.predictions:
            return None
        
        predictions_list = self.predictions
        accuracy = np.mean([p['is_correct'] for p in predictions_list]) * 100
        avg_confidence = np.mean([p['confidence'] for p in predictions_list])
        avg_inference_time = np.mean(self.inference_times)
        
        # Class-wise accuracy
        real_preds = [p for p in predictions_list if p['true_label'] == 0]
        fake_preds = [p for p in predictions_list if p['true_label'] == 1]
        
        real_acc = np.mean([p['is_correct'] for p in real_preds]) * 100 if real_preds else 0
        fake_acc = np.mean([p['is_correct'] for p in fake_preds]) * 100 if fake_preds else 0
        
        # Confusion matrix
        tp = sum(1 for p in fake_preds if p['is_correct'])
        tn = sum(1 for p in real_preds if p['is_correct'])
        fp = sum(1 for p in real_preds if not p['is_correct'])
        fn = sum(1 for p in fake_preds if not p['is_correct'])
        
        # Metrikleri hesapla
        sensitivity = tp / (tp + fn) * 100 if (tp + fn) > 0 else 0
        specificity = tn / (tn + fp) * 100 if (tn + fp) > 0 else 0
        precision = tp / (tp + fp) * 100 if (tp + fp) > 0 else 0
        f1_score = 2 * (precision * sensitivity) / (precision + sensitivity) if (precision + sensitivity) > 0 else 0
        
        return {
            'accuracy': accuracy,
            'real_accuracy': real_acc,
            'fake_accuracy': fake_acc,
            'avg_confidence': avg_confidence,
            'avg_inference_time': avg_inference_time,
            'true_positives': tp,
            'true_negatives': tn,
            'false_positives': fp,
            'false_negatives': fn,
            'total_tests': len(self.predictions),
            'sensitivity': sensitivity,
            'specificity': specificity,
            'precision': precision,
            'f1_score': f1_score
        }


def main():
    """Test et"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"🖥️  Device: {device}\n")
    
    # Model yükle
    model_path = os.path.join(script_dir, "../../models/deepfake_detector_best.pth")
    tester = DeepfakeTester(model_path, device)
    
    print("\n" + "=" * 70)
    print("🎯 DEEPFAKE DETECTOR MODEL TEST")
    print("=" * 70)
    
    # Test REAL frame'ler
    print("\n📊 REAL Frame'ler Test Ediliyor...")
    print("-" * 70)
    real_dir = os.path.join(script_dir, "data/real")
    real_subdirs = sorted(os.listdir(real_dir))[:5]  # İlk 5 klasör
    
    real_frame_count = 0
    for subdir in real_subdirs:
        subdir_path = os.path.join(real_dir, subdir)
        if os.path.isdir(subdir_path):
            real_frames = sorted([f for f in os.listdir(subdir_path) if f.endswith('.png')])[:4]
            for frame in real_frames:
                frame_path = os.path.join(subdir_path, frame)
                label, conf, fake_prob, real_prob = tester.predict_image(frame_path, true_label=0)
                if label:
                    is_correct = "✅" if "REAL" in label else "❌"
                    print(f"   {is_correct} {label:12} | REAL: {real_prob:6.1f}% FAKE: {fake_prob:6.1f}%")
                    real_frame_count += 1
    
    print(f"\n   📈 Test edilen REAL frame: {real_frame_count}")
    
    # Test FAKE frame'ler
    print("\n📊 FAKE Frame'ler Test Ediliyor...")
    print("-" * 70)
    fake_dir = os.path.join(script_dir, "data/fake")
    fake_subdirs = sorted(os.listdir(fake_dir))[:5]  # İlk 5 klasör
    
    fake_frame_count = 0
    for subdir in fake_subdirs:
        subdir_path = os.path.join(fake_dir, subdir)
        if os.path.isdir(subdir_path):
            fake_frames = sorted([f for f in os.listdir(subdir_path) if f.endswith('.png')])[:4]
            for frame in fake_frames:
                frame_path = os.path.join(subdir_path, frame)
                label, conf, fake_prob, real_prob = tester.predict_image(frame_path, true_label=1)
                if label:
                    is_correct = "✅" if "FAKE" in label else "❌"
                    print(f"   {is_correct} {label:12} | REAL: {real_prob:6.1f}% FAKE: {fake_prob:6.1f}%")
                    fake_frame_count += 1
    
    print(f"\n   📈 Test edilen FAKE frame: {fake_frame_count}")
    
    # İstatistikleri al
    stats = tester.get_stats()
    
    if stats:
        print("\n" + "=" * 70)
        print("📊 DETAYLI SONUÇLAR")
        print("=" * 70)
        
        print(f"\n🎯 ACCURACY METRIKLERI:")
        print(f"   ├─ Genel Accuracy:        {stats['accuracy']:.2f}%")
        print(f"   ├─ REAL Accuracy:         {stats['real_accuracy']:.2f}%")
        print(f"   └─ FAKE Accuracy:         {stats['fake_accuracy']:.2f}%")
        
        print(f"\n📈 PERFORMANS METRIKLERI:")
        print(f"   ├─ Sensitivity (True Positive Rate):  {stats['sensitivity']:.2f}%")
        print(f"   ├─ Specificity (True Negative Rate):  {stats['specificity']:.2f}%")
        print(f"   ├─ Precision (Positive Predictive):  {stats['precision']:.2f}%")
        print(f"   └─ F1-Score:                         {stats['f1_score']:.2f}%")
        
        print(f"\n🔍 CONFUSION MATRIX:")
        print(f"   ├─ True Positives (FAKE doğru):      {stats['true_positives']}")
        print(f"   ├─ True Negatives (REAL doğru):      {stats['true_negatives']}")
        print(f"   ├─ False Positives (REAL→FAKE):      {stats['false_positives']}")
        print(f"   └─ False Negatives (FAKE→REAL):      {stats['false_negatives']}")
        
        print(f"\n⏱️  INFERENCE TİME:")
        print(f"   ├─ Ort. İnference Süresi:  {stats['avg_inference_time']:.2f} ms")
        print(f"   ├─ Test edilen frame:      {stats['total_tests']}")
        print(f"   └─ FPS (hesaplı):          {1000/stats['avg_inference_time']:.1f} fps")
        
        print("\n" + "=" * 70)
        print("✨ TEST TAMAMLANDI!")
        print("=" * 70)


if __name__ == "__main__":
    main()
