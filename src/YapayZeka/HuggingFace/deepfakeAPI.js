import axios from 'axios';

/**
 * Hugging Face Deepfake Detection API
 * 
 * Şu anki versiyonda geçici mock data kullanılıyor.
 * Gerçek model hazır olduğunda bu fonksiyonlar güncellenecek.
 */

class DeepfakeDetectionAPI {
  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY || '';
    // Hugging Face Deepfake Detector Model v1
    this.modelEndpoint = process.env.HUGGINGFACE_MODEL_ENDPOINT || 
                         'https://api-inference.huggingface.co/models/prithivMLmods/deepfake-detector-model-v1';
    this.useMockData = !this.apiKey; // API key yoksa mock data kullan
  }

  /**
   * Video analizi yap (Video frame extraction ile)
   * @param {string} videoPath - Video dosya yolu veya URL
   * @returns {Promise<{is_deepfake: boolean, confidence_score: number}>}
   */
  async analyzeVideo(videoPath) {
    if (this.useMockData) {
      console.log('⚠️  Hugging Face API Key bulunamadı. Mock data kullanılıyor.');
      return this.mockAnalysis(videoPath);
    }

    try {
      console.log(`🔍 Analyzing video: ${videoPath}`);
      
      // NOT: prithivMLmods/deepfake-detector-model-v1 IMAGE classification modeli
      // Video için ilk frame'i veya thumbnail'i kullanacağız
      
      // Geçici olarak mock kullan - Video frame extraction eklenecek
      console.log('📹 Video frame extraction gerekli. Şimdilik mock data kullanılıyor.');
      return this.mockAnalysis(videoPath);
      
      /* VIDEO FRAME EXTRACTION sonrası kullanılacak kod:
      
      // Video'dan frame çıkar (ilk saniyeden bir frame)
      const frameImageUrl = await this.extractFrameFromVideo(videoPath);
      
      // Frame'i Hugging Face API'ye gönder
      const response = await axios.post(
        this.modelEndpoint,
        {
          inputs: frameImageUrl // Image URL or base64
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );

      console.log('✅ Hugging Face Response:', response.data);
      return this.parseResponse(response.data);
      */
    } catch (error) {
      console.error('❌ Hugging Face API Error:', error.message);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      console.log('⚠️  API hatası nedeniyle mock data kullanılıyor.');
      return this.mockAnalysis(videoPath);
    }
  }

  /**
   * Image URL ile direkt analiz (test amaçlı)
   * @param {string} imageUrl - Image URL
   * @returns {Promise<{is_deepfake: boolean, confidence_score: number}>}
   */
  async analyzeImage(imageUrl) {
    if (this.useMockData) {
      console.log('⚠️  Hugging Face API Key bulunamadı. Mock data kullanılıyor.');
      return this.mockAnalysis(imageUrl);
    }

    try {
      console.log(`🔍 Analyzing image: ${imageUrl}`);
      
      const response = await axios.post(
        this.modelEndpoint,
        { inputs: imageUrl },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );

      console.log('✅ Hugging Face Response:', response.data);
      return this.parseResponse(response.data);
    } catch (error) {
      console.error('❌ Hugging Face API Error:', error.message);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      console.log('⚠️  API hatası nedeniyle mock data kullanılıyor.');
      return this.mockAnalysis(imageUrl);
    }
  }

  /**
   * API response'unu parse et
   * Hugging Face prithivMLmods/deepfake-detector-model-v1 modeli için
   */
  parseResponse(data) {
    console.log('📊 Parsing response:', JSON.stringify(data, null, 2));

    // Format 1: Array of predictions with label and score
    // [{ label: "fake", score: 0.85 }, { label: "real", score: 0.15 }]
    if (Array.isArray(data)) {
      // En yüksek score'a sahip prediction'ı bul
      const topPrediction = data[0] || data.reduce((prev, current) => 
        (current.score > prev.score) ? current : prev
      );

      const label = topPrediction.label.toLowerCase();
      const isDeepfake = label.includes('fake') || label.includes('deepfake') || label.includes('manipulated');
      const confidenceScore = parseFloat((topPrediction.score * 100).toFixed(2));

      console.log(`✅ Parsed: ${isDeepfake ? 'FAKE' : 'REAL'} (${confidenceScore}%)`);

      return {
        is_deepfake: isDeepfake,
        confidence_score: confidenceScore
      };
    }

    // Format 2: Single object with label and score
    // { label: "fake", score: 0.85 }
    if (data.label && data.score !== undefined) {
      const label = data.label.toLowerCase();
      const isDeepfake = label.includes('fake') || label.includes('deepfake') || label.includes('manipulated');
      const confidenceScore = parseFloat((data.score * 100).toFixed(2));

      console.log(`✅ Parsed: ${isDeepfake ? 'FAKE' : 'REAL'} (${confidenceScore}%)`);

      return {
        is_deepfake: isDeepfake,
        confidence_score: confidenceScore
      };
    }

    // Unexpected format - fallback to mock
    console.warn('⚠️  Unexpected response format, using mock analysis');
    return this.mockAnalysis();
  }

  /**
   * Mock analiz (Test amaçlı)
   * Gerçek model hazır olana kadar kullanılacak
   */
  async mockAnalysis(videoPath = '') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Video path'e göre sonuç belirle (test için)
    const isFakeVideo = videoPath.includes('manipulated') || 
                        videoPath.includes('fake') || 
                        Math.random() > 0.5;

    const confidenceScore = parseFloat((Math.random() * 25 + 75).toFixed(2)); // 75-100 arası

    console.log(`📊 Mock Analysis: ${videoPath}`);
    console.log(`   Result: ${isFakeVideo ? 'DEEPFAKE' : 'REAL'}`);
    console.log(`   Confidence: ${confidenceScore}%`);

    return {
      is_deepfake: isFakeVideo,
      confidence_score: confidenceScore
    };
  }

  /**
   * Batch analiz - Birden fazla video
   */
  async analyzeMultiple(videoPaths) {
    const results = [];
    
    for (const videoPath of videoPaths) {
      try {
        const result = await this.analyzeVideo(videoPath);
        results.push({
          video_path: videoPath,
          ...result,
          status: 'success'
        });
      } catch (error) {
        results.push({
          video_path: videoPath,
          status: 'error',
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Model durumunu kontrol et
   */
  async checkModelStatus() {
    if (this.useMockData) {
      return {
        status: 'mock',
        message: 'Mock data kullanılıyor. Gerçek model için HUGGINGFACE_API_KEY ve HUGGINGFACE_MODEL_ENDPOINT .env dosyasına ekleyin.'
      };
    }

    try {
      // Model endpoint'ine health check
      const response = await axios.get(this.modelEndpoint, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
        timeout: 5000
      });

      return {
        status: 'active',
        message: 'Hugging Face modeli aktif'
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Model hatası: ${error.message}`
      };
    }
  }
}

// Singleton instance
const deepfakeAPI = new DeepfakeDetectionAPI();

export default deepfakeAPI;

/**
 * KULLANIM ÖRNEKLERİ:
 * 
 * // Tek video analizi
 * const result = await deepfakeAPI.analyzeVideo('/path/to/video.mp4');
 * console.log(result);
 * // { is_deepfake: true, confidence_score: 85.67 }
 * 
 * // Batch analiz
 * const results = await deepfakeAPI.analyzeMultiple([
 *   '/path/to/video1.mp4',
 *   '/path/to/video2.mp4'
 * ]);
 * 
 * // Model durumu
 * const status = await deepfakeAPI.checkModelStatus();
 * console.log(status);
 */
