import torch
import torch.nn as nn
from torchvision import models


class DeepfakeDetector(nn.Module):
    """ResNet50 tabanlı Deepfake Tespit Modeli"""
    
    def __init__(self, num_classes=2, pretrained=True):
        """
        Args:
            num_classes: Sınıf sayısı (2 = Fake/Real)
            pretrained: ImageNet pre-trained ağırlıklarını kullan
        """
        super(DeepfakeDetector, self).__init__()
        
        # Pre-trained ResNet50
        self.backbone = models.resnet50(pretrained=pretrained)
        
        # Son katmanı değiştir (deepfake sınıflandırması için)
        num_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Sequential(
            nn.Linear(num_features, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, num_classes)
        )
    
    def forward(self, x):
        """
        Forward pass
        
        Args:
            x: Input tensor (batch_size, 3, 224, 224)
        
        Returns:
            Logits (batch_size, num_classes)
        """
        return self.backbone(x)


def get_model(device, pretrained=True):
    """Model oluştur ve device'a taşı"""
    model = DeepfakeDetector(num_classes=2, pretrained=pretrained)
    model = model.to(device)
    return model
