import torch
import cv2
from pathlib import Path
import numpy as np
from torchvision import transforms

from model import get_model


class DeepfakeTester:
    """Eğitilmiş modeli test etmek için sınıf"""
    
    def __init__(self, model_path, device):
        self.device = device
        self.model = get_model(device, pretrained=False)
        self.model.load_state_dict(torch.load(model_path, map_location=device))
        self.model.eval()
        
        # Transform
        self.transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                               std=[0.229, 0.224, 0.225])
        ])
        
        print("✅ Model yüklendi")
    
    def predict_image(self, image_path):
        """Tek bir frame'i test et"""
        image = cv2.imread(str(image_path))
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        image_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(image_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            prediction = torch.argmax(probabilities, dim=1).item()
            confidence = probabilities[0][prediction].item() * 100
        
        label = "FAKE ⚠️" if prediction == 1 else "REAL ✓"
        return label, confidence
    
    def predict_video(self, video_path, frame_skip=10):
        """Video'yu test et (ortalama skorla)"""
        cap = cv2.VideoCapture(str(video_path))
        frame_count = 0
        fake_scores = []
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            if frame_count % frame_skip == 0:
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                image_tensor = self.transform(frame).unsqueeze(0).to(self.device)
                
                with torch.no_grad():
                    outputs = self.model(image_tensor)
                    probabilities = torch.softmax(outputs, dim=1)
                    fake_score = probabilities[0][1].item()  # FAKE olma olasılığı
                    fake_scores.append(fake_score)
            
            frame_count += 1
        
        cap.release()
        
        avg_fake_score = np.mean(fake_scores)
        prediction = "FAKE ⚠️" if avg_fake_score > 0.5 else "REAL ✓"
        confidence = max(avg_fake_score, 1 - avg_fake_score) * 100
        
        return prediction, confidence, avg_fake_score


def test_image():
    """Test image örneği"""
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    tester = DeepfakeTester("models/deepfake_detector_best.pth", device)
    
    # Test et
    image_path = "data/real/frame_000000.png"  # Kendi yolunu gir
    label, confidence = tester.predict_image(image_path)
    
    print(f"\n📷 Image Prediction:")
    print(f"   Prediction: {label}")
    print(f"   Confidence: {confidence:.2f}%")


def test_video():
    """Test video örneği"""
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    tester = DeepfakeTester("models/deepfake_detector_best.pth", device)
    
    # Test et
    video_path = "dataset/DFD_original sequences/video.mp4"  # Kendi yolunu gir
    prediction, confidence, avg_score = tester.predict_video(video_path)
    
    print(f"\n🎬 Video Prediction:")
    print(f"   Prediction: {prediction}")
    print(f"   Confidence: {confidence:.2f}%")
    print(f"   Average FAKE Score: {avg_score:.4f}")


if __name__ == "__main__":
    print("Lütfen test_image() veya test_video() çalıştır")
    # test_image()
    # test_video()
