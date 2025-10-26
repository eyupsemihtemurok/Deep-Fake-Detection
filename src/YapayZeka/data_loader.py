import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
import cv2
from pathlib import Path
import numpy as np
from tqdm import tqdm


class DeepfakeDataset(Dataset):
    """Frame'leri yükleyen PyTorch Dataset sınıfı"""
    
    def __init__(self, data_dir, transform=None):
        """
        Args:
            data_dir: data/ klasörünün yolu
            transform: Image transformasyonları (augmentation)
        """
        self.data_dir = Path(data_dir)
        self.transform = transform
        self.images = []
        self.labels = []
        
        # Frame'leri yükle
        self._load_images()
    
    def _load_images(self):
        """data/fake ve data/real klasörlerindeki tüm frame'leri yükle"""
        print("📁 Frame'ler yükleniyor...")
        
        # FAKE frame'leri yükle (label: 1)
        fake_dir = self.data_dir / "fake"
        if fake_dir.exists():
            fake_frames = list(fake_dir.rglob("*.png")) + list(fake_dir.rglob("*.jpg"))
            print(f"   ✅ FAKE frame'ler: {len(fake_frames)}")
            for frame_path in fake_frames:
                self.images.append(str(frame_path))
                self.labels.append(1)
        
        # REAL frame'leri yükle (label: 0)
        real_dir = self.data_dir / "real"
        if real_dir.exists():
            real_frames = list(real_dir.rglob("*.png")) + list(real_dir.rglob("*.jpg"))
            print(f"   ✅ REAL frame'ler: {len(real_frames)}")
            for frame_path in real_frames:
                self.images.append(str(frame_path))
                self.labels.append(0)
        
        print(f"   📊 Toplam frame'ler: {len(self.images)}\n")
    
    def __len__(self):
        return len(self.images)
    
    def __getitem__(self, idx):
        """Tek bir frame'i yükle"""
        img_path = self.images[idx]
        label = self.labels[idx]
        
        # Frame'i oku
        image = cv2.imread(img_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Transform uygula
        if self.transform:
            image = self.transform(image)
        else:
            # Default: tensor'a dönüştür
            image = torch.from_numpy(image).float().permute(2, 0, 1)
            image = image / 255.0  # Normalize et
        
        return image, torch.tensor(label, dtype=torch.long)


def get_data_loaders(data_dir, batch_size=32, train_split=0.8, num_workers=4):
    """
    Train ve Validation DataLoader'ları oluştur
    
    Args:
        data_dir: data/ klasörünün yolu
        batch_size: Batch boyutu
        train_split: Eğitim/Validation oranı (0.8 = %80 train, %20 validation)
        num_workers: Paralel veri yükleme işçi sayısı
    
    Returns:
        train_loader, val_loader
    """
    
    # Transform işlemleri
    transform = transforms.Compose([
        transforms.ToPILImage(),
        transforms.Resize((224, 224)),  # ResNet50 input size
        transforms.RandomHorizontalFlip(p=0.5),  # Data augmentation
        transforms.RandomRotation(10),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                           std=[0.229, 0.224, 0.225])  # ImageNet normalization
    ])
    
    # Dataset oluştur
    dataset = DeepfakeDataset(data_dir, transform=transform)
    
    # Train/Validation olarak ayır
    train_size = int(len(dataset) * train_split)
    val_size = len(dataset) - train_size
    
    train_dataset, val_dataset = torch.utils.data.random_split(
        dataset, 
        [train_size, val_size]
    )
    
    print(f"📊 Dataset Ayırımı:")
    print(f"   Train: {train_size} frame'ler")
    print(f"   Validation: {val_size} frame'ler\n")
    
    # DataLoader oluştur
    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
        pin_memory=True
    )
    
    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=True
    )
    
    return train_loader, val_loader
