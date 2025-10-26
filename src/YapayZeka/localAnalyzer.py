#!/usr/bin/env python3
"""
Local Video Deepfake Analyzer
Trained ResNet50 modelini kullanarak video analizi yapar
"""
import warnings
warnings.filterwarnings('ignore', category=UserWarning)

import torch
import cv2
import numpy as np
from pathlib import Path
import json
import sys
import os

# ==================== MODEL SETUP ====================
MODEL_PATH = Path(__file__).parent.parent.parent / "models" / "deepfake_detector_best.pth"

from model import get_model
from torchvision import transforms


def convert_video_url_to_path(video_url):
    """Web URL'sini dosya path'ine dönüştür"""
    if not video_url.startswith('/videos/'):
        return video_url
    
    parts = video_url.split('/')
    
    if 'fake' in parts:
        dataset_path = Path(__file__).parent / "dataset" / "DFD_manipulated_sequences"
        filename = '/'.join(parts[parts.index('fake')+1:])
        return str(dataset_path / filename)
    
    elif 'real' in parts:
        dataset_path = Path(__file__).parent / "dataset" / "DFD_original sequences"
        filename = '/'.join(parts[parts.index('real')+1:])
        return str(dataset_path / filename)
    
    return video_url


class DeepfakeAnalyzer:
    """Deepfake analiz sınıfı"""
    
    def __init__(self):
        """Model ve cihaz initilaize et"""
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Model path kontrol et
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"❌ Model bulunamadı: {MODEL_PATH}")
        
        try:
            # Model oluştur
            self.model = get_model(self.device, pretrained=False)
            
            # Model ağırlıklarını yükle
            checkpoint = torch.load(MODEL_PATH, map_location=self.device, weights_only=False)
            
            # Checkpoint formatını kontrol et
            if isinstance(checkpoint, dict):
                if 'model_state_dict' in checkpoint:
                    self.model.load_state_dict(checkpoint['model_state_dict'])
                elif 'state_dict' in checkpoint:
                    self.model.load_state_dict(checkpoint['state_dict'])
                else:
                    self.model.load_state_dict(checkpoint)
            else:
                self.model.load_state_dict(checkpoint)
            
            self.model.eval()
            
            # Image transforms - eğitim sırasında kullanılan ile aynı
            self.transform = transforms.Compose([
                transforms.ToPILImage(),
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=[0.485, 0.456, 0.406],
                    std=[0.229, 0.224, 0.225]
                )
            ])
            
            sys.stderr.write(f"✅ Model başarıyla yüklendi\n")
            sys.stderr.write(f"📱 Device: {self.device}\n")
            sys.stderr.write(f"📁 Model: {MODEL_PATH}\n")
            
        except Exception as e:
            sys.stderr.write(f"❌ Model yükleme hatası: {e}\n")
            raise
    
    def analyze_frame(self, frame):
        """Tek frame'i analiz et"""
        try:
            # BGR to RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Transform uygula
            tensor = self.transform(rgb_frame).unsqueeze(0).to(self.device)
            
            # Prediction
            with torch.no_grad():
                outputs = self.model(tensor)
                probs = torch.softmax(outputs, dim=1)
                
                # Scores al (softmax ile normalize edilmiş)
                scores = probs[0].cpu().numpy()
                prediction = np.argmax(scores)
                confidence = scores[prediction]
            
            return {
                'prediction': int(prediction),  # 0=REAL, 1=FAKE
                'confidence': float(confidence),
                'scores': {
                    'real': float(scores[0]),
                    'fake': float(scores[1])
                }
            }
        
        except Exception as e:
            sys.stderr.write(f"Frame Error: {e}\n")
            return None
    
    def analyze_video(self, video_path, frame_skip=1):
        """Video'yu analiz et"""
        try:
            # URL'yi dosya path'ine çevir
            actual_path = convert_video_url_to_path(video_path)
            
            # Debug info
            sys.stderr.write(f"\n{'='*60}\n")
            sys.stderr.write(f"Video URL: {video_path}\n")
            sys.stderr.write(f"Path: {actual_path}\n")
            
            # Dosya var mı kontrol et
            if not os.path.exists(actual_path):
                sys.stderr.write(f"File not found: {actual_path}\n")
                return {
                    'success': False,
                    'error': f'Video dosyası bulunamadı'
                }
            
            sys.stderr.write(f"File found - Starting analysis...\n")
            
            # Video aç
            cap = cv2.VideoCapture(actual_path)
            
            if not cap.isOpened():
                sys.stderr.write(f"Cannot open video\n")
                return {
                    'success': False,
                    'error': 'Video açılamadı'
                }
            
            # Video bilgisi
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = cap.get(cv2.CAP_PROP_FPS)
            sys.stderr.write(f"Total Frames: {total_frames}, FPS: {fps}, frame_skip={frame_skip}\n")
            
            predictions = []
            confidences = []
            frame_count = 0
            processed_frames = 0
            
            # Video'yu frame'lere böl ve analiz et
            while True:
                ret, frame = cap.read()
                
                if not ret:
                    break
                
                # Frame skip uygula
                if frame_count % frame_skip == 0:
                    result = self.analyze_frame(frame)
                    
                    if result:
                        predictions.append(result['prediction'])
                        confidences.append(result['confidence'])
                        processed_frames += 1
                        
                        # İlk 3 frame'i debug'la
                        if processed_frames <= 3:
                            pred_label = "FAKE" if result['prediction'] == 1 else "REAL"
                            sys.stderr.write(
                                f"  Frame {processed_frames}: {pred_label} "
                                f"(conf={result['confidence']*100:.2f}%)\n"
                            )
                
                frame_count += 1
            
            cap.release()
            
            # Sonuç kontrol et
            if not predictions:
                sys.stderr.write(f"❌ Hiç frame işlenemedi\n")
                return {
                    'success': False,
                    'error': 'Video frame\'leri işlenemedi'
                }
            
            # Tahminleri topla
            fake_count = sum(1 for p in predictions if p == 1)
            real_count = sum(1 for p in predictions if p == 0)
            
            # WEIGHTED MAJORITY VOTING - confidence ile ağırlıklı karar
            # Her tahmin için confidence'ı weight olarak kullan
            weighted_fake_score = 0
            weighted_real_score = 0
            
            for pred, conf in zip(predictions, confidences):
                if pred == 1:  # FAKE
                    weighted_fake_score += conf
                else:  # REAL
                    weighted_real_score += conf
            
            # Total ağırlık
            total_weight = weighted_fake_score + weighted_real_score
            
            # Hangisinin toplam ağırlığı daha yüksekse o karar
            is_fake_prediction = weighted_fake_score > weighted_real_score
            
            # CONFIDENCE SCORE = Karar verilen label'ın toplam ağırlığı / tüm ağırlıkların toplamı
            if is_fake_prediction:
                # Model FAKE tahmini yaptıysa
                confidence_score = (weighted_fake_score / total_weight) * 100 if total_weight > 0 else 0
            else:
                # Model REAL tahmini yaptıysa
                confidence_score = (weighted_real_score / total_weight) * 100 if total_weight > 0 else 0
            
            # ⭐ MANTIK:
            # Eğer model REAL diyorsa VE confidence >= 80% → ORİJİNAL (REAL)
            # Eğer model REAL diyorsa VE confidence < 80% → DEEPFAKE (FAKE)
            # Eğer model FAKE diyorsa → HER ZAMAN DEEPFAKE (FAKE)
            
            CONFIDENCE_THRESHOLD = 80.0
            
            if is_fake_prediction:
                # Model zaten FAKE dedi
                final_prediction = 'FAKE'
                final_confidence = confidence_score
                sys.stderr.write(f"[DEEPFAKE] Model predicted FAKE with {confidence_score:.2f}% confidence\n")
            else:
                # Model REAL dedi - confidence'a bak
                if confidence_score >= CONFIDENCE_THRESHOLD:
                    # Yüksek güven → ORİJİNAL
                    final_prediction = 'REAL'
                    final_confidence = confidence_score
                    sys.stderr.write(f"[ORIGINAL] High confidence ({confidence_score:.2f}%) - REAL VIDEO\n")
                else:
                    # Düşük güven → DEEPFAKE
                    final_prediction = 'FAKE'
                    final_confidence = confidence_score
                    sys.stderr.write(f"[DEEPFAKE] Low confidence ({confidence_score:.2f}%) - DEEPFAKE VIDEO\n")
            
            # Debug sonuç
            sys.stderr.write(f"\n[RESULTS]\n")
            sys.stderr.write(f"  Total Frames Analyzed: {len(predictions)}\n")
            sys.stderr.write(f"  FAKE Predictions: {fake_count}\n")
            sys.stderr.write(f"  REAL Predictions: {real_count}\n")
            sys.stderr.write(f"  Weighted FAKE Score: {weighted_fake_score:.4f}\n")
            sys.stderr.write(f"  Weighted REAL Score: {weighted_real_score:.4f}\n")
            sys.stderr.write(f"  Raw Model Decision: {'FAKE' if is_fake_prediction else 'REAL'}\n")
            sys.stderr.write(f"  Confidence Score: {confidence_score:.2f}%\n")
            sys.stderr.write(f"  Final Decision: {final_prediction}\n")
            sys.stderr.write(f"{'='*60}\n\n")
            
            return {
                'success': True,
                'prediction': final_prediction,
                'confidence': round(final_confidence, 2),
                'frames_analyzed': processed_frames,
                'fake_count': fake_count,
                'real_count': real_count,
                'raw_predictions': predictions[:20]  # İlk 20 tahmin
            }
        
        except Exception as e:
            sys.stderr.write(f"❌ Video analiz hatası: {e}\n")
            return {
                'success': False,
                'error': str(e)
            }


def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print(json.dumps({
            'success': False,
            'error': 'Video yolu parametresi gerekli'
        }))
        sys.exit(1)
    
    video_path = sys.argv[1]
    frame_skip = int(sys.argv[2]) if len(sys.argv) > 2 else 1  # Default: 1 = tüm frame'ler
    
    try:
        analyzer = DeepfakeAnalyzer()
        result = analyzer.analyze_video(video_path, frame_skip=frame_skip)
        print(json.dumps(result))
    
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.exit(1)


if __name__ == "__main__":
    main()
