# 🤖 Hugging Face Deepfake Detector API Kullanım Rehberi

## Model Bilgileri
- **Model:** `prithivMLmods/deepfake-detector-model-v1`
- **Tip:** Image Classification (SiglipForImageClassification)
- **API Endpoint:** https://api-inference.huggingface.co/models/prithivMLmods/deepfake-detector-model-v1
- **Accuracy:** %94.44

## Label Space
- **Class 0:** fake (Deepfake/Manipulated)
- **Class 1:** real (Original/Authentic)

## 🔑 API Key Alma

1. Hugging Face hesabı oluştur: https://huggingface.co/join
2. Settings > Access Tokens: https://huggingface.co/settings/tokens
3. "New token" butonuna tıkla
4. Token adı ver (örn: "deepfake-detector")
5. Role: "Read" seç
6. "Generate token" tıkla
7. Token'ı kopyala

## 📝 .env Dosyasına Ekleme

Backend `.env` dosyasını aç:
```bash
c:\Users\Tolga\Desktop\Projeler\VS Code Projeleri\Hackathon\src\backend\.env
```

Aşağıdaki satırları ekle:
```env
# Hugging Face API
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
HUGGINGFACE_MODEL_ENDPOINT=https://api-inference.huggingface.co/models/prithivMLmods/deepfake-detector-model-v1
```

## 🚀 Kullanım

### Mock Data (API Key Olmadan)
- API key yoksa otomatik olarak mock data kullanılır
- Test amaçlı rastgele sonuçlar döner
- Development için yeterli

### Gerçek API (API Key ile)
```javascript
// deepfakeAPI.js otomatik olarak API key'i kontrol eder
// .env dosyasında HUGGINGFACE_API_KEY varsa gerçek API kullanılır

const result = await deepfakeAPI.analyzeImage(imageUrl);
// { is_deepfake: true, confidence_score: 85.67 }
```

## 📊 API Response Formatı

### Başarılı Response
```json
[
  {
    "label": "fake",
    "score": 0.8567
  },
  {
    "label": "real",
    "score": 0.1433
  }
]
```

### Parse Edilen Format
```json
{
  "is_deepfake": true,
  "confidence_score": 85.67
}
```

## ⚠️ Önemli Notlar

### Video Analizi
- Bu model **IMAGE** classification için tasarlanmış
- Video analizi için **video frame extraction** gerekli
- Şu anki implementasyon mock data kullanıyor
- İlerde video frame extraction eklenecek

### Rate Limiting
- Hugging Face Inference API rate limit'e sahip
- Free tier: Dakikada ~30 istek
- Model ilk çalıştırmada yüklenebilir (20-30 saniye)

### Model Yükleme Süresi
- İlk istek 20-60 saniye sürebilir (model cold start)
- Sonraki istekler daha hızlı (~2-5 saniye)
- Timeout 60 saniye olarak ayarlandı

## 🔄 Video Frame Extraction (Gelecek)

Video analizi için frame extraction eklenmesi gerekiyor:

```javascript
// Örnek implementasyon (TODO)
const extractFrameFromVideo = async (videoPath) => {
  // FFmpeg veya benzeri araç ile video'dan frame çıkar
  // İlk 1-5 saniyeden frame'ler al
  // Frame'leri base64 veya URL olarak döndür
  return frameImageUrl;
};
```

## 🧪 Test Etme

### 1. Mock Data ile Test
```bash
# .env dosyasında HUGGINGFACE_API_KEY yoksa
cd src/backend
npm run dev

# Frontend
cd src/frontend
npm run dev
```

### 2. Gerçek API ile Test
```bash
# .env dosyasına API key ekle
HUGGINGFACE_API_KEY=hf_your_token_here

# Sunucuyu yeniden başlat
npm run dev
```

### 3. Video Kütüphanesi'nden Test
1. http://localhost:5173/video-library
2. "Local Videoları Yükle" tıkla
3. "AI Analiz" dropdown'ından "Modeli Aktif Et"
4. Sonuçları gör

## 📈 Performans Metrikleri

```
Classification Report:
              precision    recall  f1-score   support

        Fake     0.97      0.92      0.94     10000
        Real     0.92      0.97      0.95      9999

    accuracy                         0.94     19999
```

## 🔗 Faydalı Linkler

- Model Card: https://huggingface.co/prithivMLmods/deepfake-detector-model-v1
- Hugging Face Docs: https://huggingface.co/docs/api-inference/index
- Inference API: https://huggingface.co/docs/api-inference/detailed_parameters
- Token Oluştur: https://huggingface.co/settings/tokens

## 🐛 Troubleshooting

### "API Key bulunamadı" Hatası
- `.env` dosyasında `HUGGINGFACE_API_KEY` kontrolü yap
- Sunucuyu yeniden başlat
- API key'in geçerli olduğundan emin ol

### "Model Loading" Timeout
- İlk istek 60 saniye sürebilir
- Sabırlı ol, model yükleniyor
- Timeout süresini artırabilirsin (deepfakeAPI.js)

### "Rate Limit Exceeded"
- Çok fazla istek gönderdin
- Birkaç dakika bekle
- Paid plan'e geç (daha yüksek limit)

## ✅ Sonuç

- ✅ API entegrasyonu hazır
- ✅ Mock data fallback var
- ✅ Error handling mevcut
- ⏳ Video frame extraction (TODO)
- ⏳ Batch processing optimization (TODO)
