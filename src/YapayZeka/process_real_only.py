import cv2
import os
from pathlib import Path
import numpy as np
from tqdm import tqdm
from datetime import datetime, timedelta


class RealVideoProcessor:
    """Sadece REAL videoların frame'lerini çıkartarak kaydeden sınıf"""
    
    def __init__(self, dataset_root, output_root, frame_skip=1):
        """
        Args:
            dataset_root: Dataset klasörünün yolu
            output_root: Çıktı klasörünün yolu (data/)
            frame_skip: Kaç framede birini kaydetmek istediğimiz
        """
        self.dataset_root = Path(dataset_root)
        self.output_root = Path(output_root)
        self.frame_skip = frame_skip
        
        # Çıktı klasörü oluştur
        self.real_dir = self.output_root / "real"
        self.real_dir.mkdir(parents=True, exist_ok=True)
        
        # Zaman takibi için
        self.start_time = None
        self.processed_videos = 0
    
    def extract_frames_from_video(self, video_path, output_dir, video_name):
        """
        Videodaki frame'leri çıkart ve kaydet
        
        Args:
            video_path: Video dosyasının yolu
            output_dir: Frame'lerin kaydedileceği dizin
            video_name: Video adı (klasör adı olarak kullanılacak)
        """
        cap = cv2.VideoCapture(str(video_path))
        
        if not cap.isOpened():
            print(f"❌ Video açılamadı: {video_path}")
            return False
        
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        
        # Video adına göre klasör oluştur
        video_output_dir = output_dir / video_name.replace('.mp4', '').replace('.avi', '')
        video_output_dir.mkdir(parents=True, exist_ok=True)
        
        frame_id = 0
        saved_frame_count = 0
        
        # Tahmini işlem süresi hesapla
        estimated_time = (frame_count / fps) / self.frame_skip if fps > 0 else 0
        print(f"  📹 {video_name}: {frame_count} frame çıkartılıyor (Tahmini: {estimated_time:.1f} saniye)...")
        
        with tqdm(total=frame_count, desc=f"  Frame çıkartılıyor", leave=False) as pbar:
            while True:
                ret, frame = cap.read()
                
                if not ret:
                    break
                
                # Frame skip uygulanıyor
                if frame_id % self.frame_skip == 0:
                    # Tüm frame'i kaydet
                    frame_path = video_output_dir / f"frame_{saved_frame_count:06d}.png"
                    cv2.imwrite(str(frame_path), frame)
                    saved_frame_count += 1
                
                frame_id += 1
                pbar.update(1)
        
        cap.release()
        
        print(f"  ✅ {saved_frame_count} frame kaydedildi: {video_output_dir}")
        self.processed_videos += 1
        return True
    
    def calculate_total_duration(self):
        """Tüm REAL videoların toplam süresini hesapla"""
        total_seconds = 0
        video_extensions = {'.mp4', '.avi', '.mov', '.flv', '.mkv'}
        all_videos = []
        
        # Real videoları bul
        real_dataset = self.dataset_root / "DFD_original sequences"
        if real_dataset.exists():
            videos = [f for f in real_dataset.glob('**/*') if f.suffix.lower() in video_extensions]
            all_videos.extend(videos)
        
        print(f"   📹 Toplam {len(all_videos)} REAL video bulundu, bilgi alınıyor...")
        
        # Progress bar ile videoları tara
        with tqdm(total=len(all_videos), desc="   Video süreleri hesaplanıyor", leave=False, ncols=80) as pbar:
            for video_path in all_videos:
                try:
                    cap = cv2.VideoCapture(str(video_path))
                    if cap.isOpened():
                        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
                        fps = int(cap.get(cv2.CAP_PROP_FPS)) or 30
                        if frame_count > 0:
                            total_seconds += frame_count / fps
                        cap.release()
                except:
                    pass
                finally:
                    pbar.update(1)
        
        return total_seconds
    
    def format_time(self, seconds):
        """Saniyeyi insan okunabilir formata dönüştür"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        
        if hours > 0:
            return f"{hours}h {minutes}m {secs}s"
        elif minutes > 0:
            return f"{minutes}m {secs}s"
        else:
            return f"{secs}s"
    
    def process_real_videos(self):
        """DFD_original sequences klasöründeki videoları işle"""
        print("\n🎬 REAL (Original) videoları işleniyor...\n")
        
        real_dataset = self.dataset_root / "DFD_original sequences"
        
        if not real_dataset.exists():
            print(f"❌ Real dataset klasörü bulunamadı: {real_dataset}")
            return
        
        video_extensions = {'.mp4', '.avi', '.mov', '.flv', '.mkv'}
        videos = [f for f in real_dataset.glob('**/*') if f.suffix.lower() in video_extensions]
        
        print(f"📊 Toplam {len(videos)} real video bulundu\n")
        
        for video_path in videos:
            relative_path = video_path.relative_to(real_dataset)
            self.extract_frames_from_video(video_path, self.real_dir, str(relative_path))
    
    def process_all(self):
        """Tüm REAL videoları işle"""
        print("=" * 60)
        print("🚀 REAL Video Frame Çıkartma İşlemi Başlatılıyor")
        print("=" * 60)
        
        # Toplam süreyi hesapla
        print("\n📊 REAL videoların toplam süresi hesaplanıyor...")
        total_duration = self.calculate_total_duration()
        estimated_finish_time = total_duration / self.frame_skip
        
        self.start_time = datetime.now()
        estimated_end_time = self.start_time + timedelta(seconds=estimated_finish_time)
        
        print(f"\n⏰ Başlama Zamanı: {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"📹 Toplam Video Süresi: {self.format_time(total_duration)}")
        print(f"⏱️  Tahmini İşlem Süresi: {self.format_time(estimated_finish_time)}")
        print(f"🎯 Tahmini Bitiş Zamanı: {estimated_end_time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        
        self.process_real_videos()
        
        # Toplam süreyi hesapla
        end_time = datetime.now()
        elapsed_time = end_time - self.start_time
        
        print("\n" + "=" * 60)
        print("✨ İşlem Tamamlandı!")
        print("=" * 60)
        print(f"⏰ Bitiş Zamanı: {end_time.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"⏱️  Geçen Süre: {elapsed_time}")
        print("=" * 60)
        self._print_statistics()
    
    def _print_statistics(self):
        """Kaydedilen frame sayılarını göster"""
        real_frames = sum(len(files) for _, _, files in os.walk(self.real_dir))
        
        print(f"\n📊 İstatistikler:")
        print(f"   ✅ Real frame'ler: {real_frames}")
        print(f"   ✅ İşlenen videolar: {self.processed_videos}")


def process_real_videos_only(dataset_path, output_path, frame_skip=5):
    """
    Sadece REAL videoları frame'lere dönüştür
    
    Args:
        dataset_path: Dataset klasörünün yolu
        output_path: Çıktı klasörünün yolu (data/)
        frame_skip: Kaç framede birini kaydetmek istediğimiz
    """
    processor = RealVideoProcessor(dataset_path, output_path, frame_skip=frame_skip)
    processor.process_all()


if __name__ == "__main__":
    # Kullanım örneği
    # Absolute path kullan - relative path'ten çalışmıyor
    script_dir = os.path.dirname(os.path.abspath(__file__))
    DATASET_PATH = os.path.join(script_dir, "dataset")
    OUTPUT_PATH = os.path.join(script_dir, "data")
    
    # frame_skip: 1 = tüm frameler, 5 = her 5. frame, 24 = her 24. frame vb.
    process_real_videos_only(DATASET_PATH, OUTPUT_PATH, frame_skip=24)
