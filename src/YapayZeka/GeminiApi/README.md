# Gemini API - Fact Checker

Gemini API kullanarak sosyal medya gönderilerinin doğruluğunu kontrol eden servis.

## 🚀 Kurulum

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. .env dosyasını oluştur
# .env.example dosyasını kopyalayıp .env olarak kaydet
# GEMINI_API_KEY'i ekle
```

## 🔑 API Key Alma

1. [Google AI Studio](https://makersuite.google.com/app/apikey) adresine git
2. "Get API Key" butonuna tıkla
3. API anahtarını kopyala
4. `.env` dosyasına ekle:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## 📖 Kullanım

### Basit Kullanım

```javascript
import GeminiFactChecker from './factChecker.js';

const checker = new GeminiFactChecker();

// Tek bir metni kontrol et
const result = await checker.checkFact('İstanbul Türkiye\'nin başkentidir.');
console.log(result);
```

### Sosyal Medya Postu Kontrolü

```javascript
const post = {
  content_text: 'Bilim insanları Mars\'ta su buldu!',
  media_type: 'image'
};

const result = await checker.checkSocialPost(post);
console.log(result.data);
```

### Toplu Kontrol

```javascript
const texts = [
  'Dünya yuvarlaktır.',
  'Güneş batıdan doğar.',
  'İnsanlar Ay\'a gitti.'
];

const results = await checker.checkFactBatch(texts);
results.forEach(result => {
  console.log(result.data);
});
```

## 🧪 Test Etme

```bash
npm test
```

veya

```bash
node testFactChecker.js
```

## 📊 Yanıt Formatı

```json
{
  "success": true,
  "data": {
    "is_verified": true,
    "confidence_score": 95,
    "fact_check_result": "true",
    "explanation": "İstanbul Türkiye'nin en kalabalık şehridir ancak başkent Ankara'dır.",
    "sources_needed": false,
    "category": "general",
    "processing_time_ms": 1234,
    "analyzed_at": "2025-10-25T10:30:00.000Z",
    "raw_text": "İstanbul Türkiye'nin başkentidir."
  }
}
```

## 🔧 Backend Entegrasyonu

Backend'e entegre etmek için:

```javascript
// backend/src/controllers/socialPostsController.js
import GeminiFactChecker from '../../../YapayZeka/GeminiApi/factChecker.js';

const checker = new GeminiFactChecker();

// Post analizi
const factCheckResult = await checker.checkSocialPost({
  content_text: post.content_text,
  media_type: post.media_type
});

// Veritabanına kaydet
await pool.request()
  .input('is_fact_checked', sql.Bit, 1)
  .input('fact_check_result', sql.NVarChar, factCheckResult.data.fact_check_result)
  .query('UPDATE SocialPosts SET is_fact_checked = @is_fact_checked...');
```

## ⚠️ Önemli Notlar

- API rate limit vardır, toplu işlemlerde ara ara bekleme yapın
- Ücretsiz tier için günlük limit: 60 request/dakika
- Hassas veriler için API key'i güvenli tutun
- Sonuçlar %100 doğru olmayabilir, kullanıcıya bilgilendirme yapın

## 📝 Fact-Check Sonuç Tipleri

- `true` - Doğrulanmış doğru bilgi
- `false` - Doğrulanmış yanlış bilgi
- `unverified` - Doğrulanamayan bilgi
- `misleading` - Yanıltıcı bilgi

## 🌟 Özellikler

- ✅ Otomatik fact-checking
- ✅ Güven skoru hesaplama
- ✅ Kategori tespiti
- ✅ Türkçe açıklama
- ✅ Toplu analiz desteği
- ✅ Sosyal medya post analizi
- ✅ Hata yönetimi

## 📞 Destek

Sorunlarınız için issue açabilirsiniz.
