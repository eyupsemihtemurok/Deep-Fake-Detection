import torch
import torch.nn as nn
from torch.optim import Adam
from torch.optim.lr_scheduler import ReduceLROnPlateau, CosineAnnealingWarmRestarts
import os
from pathlib import Path
from datetime import datetime
from tqdm import tqdm
import numpy as np
import matplotlib.pyplot as plt

from data_loader import get_data_loaders
from model import get_model


class Trainer:
    """Deepfake Detector'ı eğitmek için sınıf"""
    
    def __init__(self, model, train_loader, val_loader, device, learning_rate=1e-3, num_epochs=20):
        self.model = model
        self.train_loader = train_loader
        self.val_loader = val_loader
        self.device = device
        self.num_epochs = num_epochs
        
        # Optimizer ve Loss (Weight Decay ekle)
        self.optimizer = Adam(model.parameters(), lr=learning_rate, weight_decay=1e-4, betas=(0.9, 0.999))
        self.criterion = nn.CrossEntropyLoss()
        
        # Scheduler: ReduceLROnPlateau
        self.scheduler = ReduceLROnPlateau(self.optimizer, 'min', factor=0.5, patience=3)
        
        # Warmup için step count
        self.current_step = 0
        self.warmup_steps = len(train_loader) * 2  # 2 epoch warmup
        self.base_lr = learning_rate
        
        # Metrikleri kaydet
        self.train_losses = []
        self.val_losses = []
        self.train_accs = []
        self.val_accs = []
    
    def warmup_lr_scheduler(self):
        """Learning rate'i warmup yap"""
        if self.current_step < self.warmup_steps:
            # Linear warmup
            warmup_factor = self.current_step / self.warmup_steps
            for param_group in self.optimizer.param_groups:
                param_group['lr'] = self.base_lr * warmup_factor
    
    def train_epoch(self):
        """Bir epoch boyunca eğit"""
        self.model.train()
        total_loss = 0
        correct = 0
        total = 0
        
        pbar = tqdm(self.train_loader, desc="Train", leave=False)
        for images, labels in pbar:
            images = images.to(self.device)
            labels = labels.to(self.device)
            
            # Forward pass
            outputs = self.model(images)
            loss = self.criterion(outputs, labels)
            
            # Backward pass
            self.optimizer.zero_grad()
            loss.backward()
            
            # Gradient Clipping (exploding gradients'i önle)
            torch.nn.utils.clip_grad_norm_(self.model.parameters(), max_norm=1.0)
            
            self.optimizer.step()
            
            # Warmup LR Scheduler
            self.warmup_lr_scheduler()
            self.current_step += 1
            
            # Metrikleri hesapla
            total_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
            pbar.set_postfix({'loss': f"{loss.item():.4f}"})
        
        avg_loss = total_loss / len(self.train_loader)
        avg_acc = 100 * correct / total
        
        return avg_loss, avg_acc
    
    def validate(self):
        """Validation yapı"""
        self.model.eval()
        total_loss = 0
        correct = 0
        total = 0
        
        with torch.no_grad():
            pbar = tqdm(self.val_loader, desc="Validation", leave=False)
            for images, labels in pbar:
                images = images.to(self.device)
                labels = labels.to(self.device)
                
                outputs = self.model(images)
                loss = self.criterion(outputs, labels)
                
                total_loss += loss.item()
                _, predicted = torch.max(outputs.data, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
                
                pbar.set_postfix({'loss': f"{loss.item():.4f}"})
        
        avg_loss = total_loss / len(self.val_loader)
        avg_acc = 100 * correct / total
        
        return avg_loss, avg_acc
    
    def train(self, num_epochs=10):
        """Tüm eğitim süreci"""
        print("\n" + "=" * 60)
        print("🚀 Deepfake Detector Eğitimi Başlatılıyor")
        print("=" * 60)
        
        start_time = datetime.now()
        best_val_acc = 0
        patience_counter = 0
        
        for epoch in range(num_epochs):
            print(f"\n📍 Epoch {epoch+1}/{num_epochs}")
            
            # Eğit
            train_loss, train_acc = self.train_epoch()
            self.train_losses.append(train_loss)
            self.train_accs.append(train_acc)
            
            # Validate
            val_loss, val_acc = self.validate()
            self.val_losses.append(val_loss)
            self.val_accs.append(val_acc)
            
            # Sonuçları göster
            print(f"   📊 Train Loss: {train_loss:.4f} | Train Accuracy: {train_acc:.2f}%")
            print(f"   📊 Val Loss: {val_loss:.4f} | Val Accuracy: {val_acc:.2f}%")
            
            # Learning rate scheduler
            self.scheduler.step(val_loss)
            
            # En iyi modeli kaydet
            if val_acc > best_val_acc:
                best_val_acc = val_acc
                patience_counter = 0
                self.save_model(f"models/deepfake_detector_best.pth")
                print(f"   ✅ En iyi model kaydedildi! (Accuracy: {val_acc:.2f}%)")
            else:
                patience_counter += 1
            
            # Early stopping
            if patience_counter >= 5:
                print(f"\n⚠️  Early stopping! Validation accuracy 5 epoch boyunca iyileşmedi.")
                break
        
        # Eğitim bitişi
        end_time = datetime.now()
        elapsed_time = end_time - start_time
        
        print("\n" + "=" * 60)
        print("✨ Eğitim Tamamlandı!")
        print("=" * 60)
        print(f"⏱️  Geçen Süre: {elapsed_time}")
        print(f"🏆 En İyi Validation Accuracy: {best_val_acc:.2f}%")
        print("=" * 60)
        
        self.plot_results()
    
    def save_model(self, path):
        """Modeli kaydet"""
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        torch.save(self.model.state_dict(), path)
    
    def plot_results(self):
        """Eğitim sonuçlarını grafikle"""
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
        
        # Loss
        ax1.plot(self.train_losses, label='Train Loss')
        ax1.plot(self.val_losses, label='Val Loss')
        ax1.set_xlabel('Epoch')
        ax1.set_ylabel('Loss')
        ax1.set_title('Loss vs Epoch')
        ax1.legend()
        ax1.grid(True)
        
        # Accuracy
        ax2.plot(self.train_accs, label='Train Accuracy')
        ax2.plot(self.val_accs, label='Val Accuracy')
        ax2.set_xlabel('Epoch')
        ax2.set_ylabel('Accuracy (%)')
        ax2.set_title('Accuracy vs Epoch')
        ax2.legend()
        ax2.grid(True)
        
        plt.tight_layout()
        plt.savefig('models/training_results.png')
        print(f"   📈 Grafik kaydedildi: models/training_results.png")
        plt.close()


def main():
    """Main eğitim fonksiyonu"""
    # Hyperparameters
    import os
    script_dir = os.path.dirname(os.path.abspath(__file__))
    DATA_DIR = os.path.join(script_dir, "data")
    BATCH_SIZE = 64
    LEARNING_RATE = 5e-4
    NUM_EPOCHS = 20
    
    # Device seç
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"🖥️  Device: {device}\n")
    
    # Data loaders oluştur
    train_loader, val_loader = get_data_loaders(DATA_DIR, batch_size=BATCH_SIZE)
    
    # Model oluştur
    model = get_model(device, pretrained=True)
    print("✅ Model yüklendi (ResNet50 pre-trained)\n")
    
    # Trainer oluştur ve eğit
    trainer = Trainer(model, train_loader, val_loader, device, learning_rate=LEARNING_RATE, num_epochs=NUM_EPOCHS)
    trainer.train(num_epochs=NUM_EPOCHS)


if __name__ == "__main__":
    main()
