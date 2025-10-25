import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Gemini API ile Fact-Checking Servisi
 * Sosyal medya gönderilerinin doğruluğunu kontrol eder
 */
class GeminiFactChecker {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY bulunamadı! .env dosyasını kontrol edin.');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  /**
   * Metni fact-check yapar
   * @param {string} text - Kontrol edilecek metin
   * @returns {Promise<Object>} Fact-check sonucu
   */
  async checkFact(text) {
    try {
      const startTime = Date.now();

      const prompt = `
Sen bir fact-checking (doğruluk kontrolü) asistanısın. Aşağıdaki metni analiz et ve şu bilgileri ver:

METIN: "${text}"

Lütfen şu formatta yanıt ver (sadece JSON formatında):
{
  "is_verified": true/false,
  "confidence_score": 0-100 arası bir sayı,
  "fact_check_result": "true" / "false" / "unverified" / "misleading",
  "explanation": "Kısa açıklama (Türkçe)",
  "sources_needed": true/false,
  "category": "politics" / "health" / "science" / "general" / "entertainment"
}

KURALLAR:
- Eğer metin doğrulanabilir bir iddia içermiyorsa: "unverified"
- Eğer metin kanıtlanabilir şekilde doğruysa: "true"
- Eğer metin kanıtlanabilir şekilde yanlışsa: "false"
- Eğer metin yanıltıcıysa: "misleading"
- confidence_score: Ne kadar eminsin (0-100)
- Sadece JSON yanıtı ver, başka açıklama ekleme
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      // JSON'ı parse et
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Gemini API geçersiz yanıt döndü');
      }

      const factCheckResult = JSON.parse(jsonMatch[0]);
      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          ...factCheckResult,
          processing_time_ms: processingTime,
          analyzed_at: new Date().toISOString(),
          raw_text: text
        }
      };

    } catch (error) {
      console.error('❌ Fact-checking hatası:', error.message);
      return {
        success: false,
        error: error.message,
        data: {
          is_verified: false,
          confidence_score: 0,
          fact_check_result: 'unverified',
          explanation: 'Analiz sırasında hata oluştu',
          processing_time_ms: 0
        }
      };
    }
  }

  /**
   * Toplu fact-check yapar (birden fazla metin)
   * @param {Array<string>} texts - Kontrol edilecek metinler
   * @returns {Promise<Array>} Fact-check sonuçları
   */
  async checkFactBatch(texts) {
    const results = [];
    
    for (const text of texts) {
      const result = await this.checkFact(text);
      results.push(result);
      
      // API rate limit için kısa bekleme
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }

  /**
   * Sosyal medya postu için özel fact-check
   * @param {Object} post - Post objesi {content_text, media_type}
   * @returns {Promise<Object>} Fact-check sonucu
   */
  async checkSocialPost(post) {
    const { content_text, media_type } = post;

    if (!content_text || content_text.trim() === '') {
      return {
        success: false,
        error: 'Boş metin analiz edilemez',
        data: {
          is_verified: false,
          confidence_score: 0,
          fact_check_result: 'unverified',
          explanation: 'Metin içeriği bulunamadı'
        }
      };
    }

    // Eğer video/resim varsa, sadece text'i kontrol et
    let enhancedText = content_text;
    if (media_type === 'video' || media_type === 'image') {
      enhancedText = `[${media_type.toUpperCase()} İÇEREN POST] ${content_text}`;
    }

    return await this.checkFact(enhancedText);
  }
}

// Export
export default GeminiFactChecker;

// Eğer direkt çalıştırılırsa test et
if (import.meta.url === `file://${process.argv[1]}`) {
  const checker = new GeminiFactChecker();
  
  console.log('🧪 Gemini Fact-Checker Test Ediliyor...\n');
  
  const testText = 'Su, sıfır derecede donar.';
  console.log(`Test Metni: "${testText}"\n`);
  
  const result = await checker.checkFact(testText);
  console.log('📊 Sonuç:');
  console.log(JSON.stringify(result, null, 2));
}
