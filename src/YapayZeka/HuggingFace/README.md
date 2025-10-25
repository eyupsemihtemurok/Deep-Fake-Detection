# Hugging Face Deepfake Detection API

Bu modül, Hugging Face'deki **prithivMLmods/deepfake-detector-model-v1** modelini kullanarak deepfake tespiti yapar.

## 🎯 Özellikler

- **Model:** prithivMLmods/deepfake-detector-model-v1
- **Tip:** Image Classification (SiglipForImageClassification)
- **Accuracy:** %94.44
- **Mock Fallback:** API key olmadan test edilebilir

## 🚀 Kurulum

```bash
cd src/YapayZeka/HuggingFace
npm install
```

## 🔑 API Key Ayarı

1. Hugging Face hesabı oluştur: https://huggingface.co
2. API Token al: https://huggingface.co/settings/tokens
3. Backend `.env` dosyasına ekle:

```env
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 📖 Kullanım

```javascript
import deepfakeAPI from './deepfakeAPI.js';

// Tek video analizi
const result = await deepfakeAPI.analyzeVideo('/path/to/video.mp4');
console.log(result);
// { is_deepfake: true, confidence_score: 85.67 }

// Batch analiz
const results = await deepfakeAPI.analyzeMultiple([
  '/path/to/video1.mp4',
  '/path/to/video2.mp4'
]);

// Model durumu kontrolü
const status = await deepfakeAPI.checkModelStatus();
```

## 📝 Notlar

- Şu anda **mock data** kullanılıyor (API key olmadan çalışır)
- Gerçek analiz için **frame extraction** gerekli (TODO)
- Model ilk istekte 20-60 saniye yüklenme süresi olabilir

## 🔗 Bağlantılar

- Model: https://huggingface.co/prithivMLmods/deepfake-detector-model-v1
- API Docs: https://huggingface.co/docs/api-inference/index
- Detaylı Dokümantasyon: `../../../HUGGINGFACE_API_GUIDE.md`
