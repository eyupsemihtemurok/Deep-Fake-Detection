import VideoLibraryModel from '../models/videoLibraryModel.js';
// import deepfakeAPI from '../../../YapayZeka/HuggingFace/deepfakeAPI.js'; // 🚫 External API kapalı
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 Kendi eğitilen model'i kullanarak analiz yap
async function analyzeWithLocalModel(filePath) {
  return new Promise((resolve, reject) => {
    // Doğru path: src/backend/src/controllers/ -> src/YapayZeka/
    const pythonScriptPath = path.join(__dirname, '..', '..', '..', 'YapayZeka', 'localAnalyzer.py');
    console.log('\n📹 Analyzing video with Python script...');
    console.log(`📂 Python Path: ${pythonScriptPath}`);
    console.log(`🎬 Video Path: ${filePath}\n`);
    
    const python = spawn('python', [pythonScriptPath, filePath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      const errorStr = data.toString();
      errorOutput += errorStr;
      // Debug ve model loading bilgileri göster
      if (errorStr.includes('✅') || 
          errorStr.includes('📹') || 
          errorStr.includes('📊') ||
          errorStr.includes('DEBUG') ||
          errorStr.includes('Frame')) {
        console.log(errorStr.trim());
      }
    });

    python.on('close', (code) => {
      if (code !== 0) {
        console.error('\n❌ Python Error:', errorOutput || output);
        reject(new Error(`Python script error: ${errorOutput || output}`));
      } else {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (e) {
          console.error('❌ JSON Parse Error:', e.message);
          console.error('Output:', output);
          reject(new Error(`Failed to parse Python output`));
        }
      }
    });

    python.on('error', (err) => {
      console.error('❌ Spawn Error:', err.message);
      reject(err);
    });
  });
}

class VideoLibraryController {
  // Tüm videoları getir (sayfalama ile) - GET /api/video-library?page=1&limit=6
  static async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      
      const allVideos = await VideoLibraryModel.getAll();
      
      // Videoları rastgele sırala (her sayfa farklı sıralama için)
      const shuffledVideos = [...allVideos].sort(() => Math.random() - 0.5);
      
      // Sayfalama hesaplamaları
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedVideos = shuffledVideos.slice(startIndex, endIndex);
      
      const totalPages = Math.ceil(shuffledVideos.length / limit);
      
      res.json({
        success: true,
        count: paginatedVideos.length,
        total: shuffledVideos.length,
        currentPage: page,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        data: paginatedVideos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Videolar getirilirken hata oluştu',
        message: error.message
      });
    }
  }

  // ID'ye göre video getir - GET /api/video-library/:id
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const video = await VideoLibraryModel.getById(id);

      if (!video) {
        return res.status(404).json({
          success: false,
          error: 'Video bulunamadı'
        });
      }

      res.json({
        success: true,
        data: video
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Video getirilirken hata oluştu',
        message: error.message
      });
    }
  }

  // Local dosyalardan videoları yükle - POST /api/video-library/load-local
  static async loadFromLocal(req, res) {
    try {
      // Önce mevcut videoları sil
      await VideoLibraryModel.deleteAll();
      
      // Videoları yükle (analiz edilmemiş olarak)
      const videos = await VideoLibraryModel.loadFromLocal();

      res.json({
        success: true,
        message: `${videos.length} video başarıyla yüklendi`,
        total: videos.length,
        data: videos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Videolar yüklenirken hata oluştu',
        message: error.message
      });
    }
  }

  // Tüm videoları analiz et - POST /api/video-library/analyze-all
  static async analyzeAll(req, res) {
    try {
      const videos = await VideoLibraryModel.getAll();
      const results = [];

      for (const video of videos) {
        try {
          // 🔥 Kendi model'i kullan
          const analysis = await analyzeWithLocalModel(video.video_url);
          
          // Sonuçları güncelle
          const updated = await VideoLibraryModel.updateAnalysis(video.test_video_id, {
            is_deepfake: analysis.prediction === 'FAKE',
            confidence_score: analysis.confidence
          });

          results.push({
            video_id: video.test_video_id,
            title: video.title,
            is_deepfake: analysis.prediction === 'FAKE',
            confidence_score: analysis.confidence,
            status: 'analyzed'
          });
        } catch (error) {
          console.error(`Video ${video.test_video_id} analiz hatası:`, error);
          results.push({
            video_id: video.test_video_id,
            title: video.title,
            status: 'error',
            error: error.message
          });
        }
      }

      res.json({
        success: true,
        message: 'Analiz tamamlandı',
        results
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Analiz sırasında hata oluştu',
        message: error.message
      });
    }
  }

  // Tek video analiz et - POST /api/video-library/analyze/:id
  static async analyzeSingle(req, res) {
    try {
      const { id } = req.params;
      const video = await VideoLibraryModel.getById(id);

      if (!video) {
        return res.status(404).json({
          success: false,
          error: 'Video bulunamadı'
        });
      }

      // 🔥 Kendi model'i kullan
      const analysis = await analyzeWithLocalModel(video.video_url);
      
      // Sonuçları güncelle
      const updated = await VideoLibraryModel.updateAnalysis(id, {
        is_deepfake: analysis.prediction === 'FAKE',
        confidence_score: analysis.confidence
      });

      res.json({
        success: true,
        message: 'Video analiz edildi',
        data: {
          video_id: updated.test_video_id,
          title: updated.title,
          is_deepfake: analysis.prediction === 'FAKE',
          confidence_score: analysis.confidence
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Video analiz edilirken hata oluştu',
        message: error.message
      });
    }
  }

  // Tek video URL ile analiz et (veritabanına kaydetmeden) - POST /api/video-library/analyze-single-url
  static async analyzeSingleUrl(req, res) {
    try {
      const { videoUrl } = req.body;

      if (!videoUrl) {
        return res.status(400).json({
          success: false,
          error: 'Video URL\'si gerekli'
        });
      }

      console.log('\n🎬 Tek video analizi başlatılıyor...');
      console.log(`📹 Video URL: ${videoUrl}`);

      // 🔥 Kendi model'i kullan
      const analysis = await analyzeWithLocalModel(videoUrl);
      
      console.log('✅ Analiz tamamlandı:', analysis);

      res.json({
        success: true,
        message: 'Video analiz edildi',
        result: {
          video_url: videoUrl,
          is_deepfake: analysis.prediction === 'FAKE',
          confidence_score: analysis.confidence,
          analyzed_at: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('❌ Video analiz hatası:', error);
      res.status(500).json({
        success: false,
        error: 'Video analiz edilirken hata oluştu',
        message: error.message
      });
    }
  }

  // Random video seç ve URL'sini döndür - GET /api/video-library/random-video
  static async getRandomVideo(req, res) {
    try {
      const datasetPath = path.join(__dirname, '..', '..', '..', 'YapayZeka', 'dataset');
      const fakeVideosPath = path.join(datasetPath, 'DFD_manipulated_sequences', 'DFD_manipulated_sequences');
      const realVideosPath = path.join(datasetPath, 'DFD_original sequences');

      const allVideos = [];

      // Fake videoları listele
      if (fs.existsSync(fakeVideosPath)) {
        const fakeFiles = fs.readdirSync(fakeVideosPath)
          .filter(file => file.endsWith('.mp4') || file.endsWith('.avi') || file.endsWith('.mov'));
        
        fakeFiles.forEach(file => {
          allVideos.push({
            url: `/videos/fake/${file}`,
            type: 'fake',
            filename: file
          });
        });
      }

      // Real videoları listele
      if (fs.existsSync(realVideosPath)) {
        const realFiles = fs.readdirSync(realVideosPath)
          .filter(file => file.endsWith('.mp4') || file.endsWith('.avi') || file.endsWith('.mov'));
        
        realFiles.forEach(file => {
          allVideos.push({
            url: `/videos/real/${file}`,
            type: 'real',
            filename: file
          });
        });
      }

      if (allVideos.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Hiç video bulunamadı'
        });
      }

      // Random video seç
      const randomIndex = Math.floor(Math.random() * allVideos.length);
      const selectedVideo = allVideos[randomIndex];

      res.json({
        success: true,
        data: selectedVideo
      });
    } catch (error) {
      console.error('❌ Random video seçme hatası:', error);
      res.status(500).json({
        success: false,
        error: 'Random video seçilirken hata oluştu',
        message: error.message
      });
    }
  }
}

export default VideoLibraryController;
