import VideoLibraryModel from '../models/videoLibraryModel.js';
import deepfakeAPI from '../../../YapayZeka/HuggingFace/deepfakeAPI.js';

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
      
      // 3 gerçek + 3 fake olacak şekilde yükle
      const videos = await VideoLibraryModel.loadFromLocal();

      res.json({
        success: true,
        message: `${videos.length} video yüklendi (${videos.filter(v => !v.is_deepfake).length} gerçek, ${videos.filter(v => v.is_deepfake).length} deepfake)`,
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
          // Deepfake API ile analiz
          const analysis = await deepfakeAPI.analyzeVideo(video.video_url);
          
          // Sonuçları güncelle
          const updated = await VideoLibraryModel.updateAnalysis(video.test_video_id, {
            is_deepfake: analysis.is_deepfake,
            confidence_score: analysis.confidence_score
          });

          results.push({
            video_id: video.test_video_id,
            title: video.title,
            is_deepfake: analysis.is_deepfake,
            confidence_score: analysis.confidence_score,
            status: 'analyzed'
          });
        } catch (error) {
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

      // Deepfake API ile analiz
      const analysis = await deepfakeAPI.analyzeVideo(video.video_url);
      
      // Sonuçları güncelle
      const updated = await VideoLibraryModel.updateAnalysis(id, {
        is_deepfake: analysis.is_deepfake,
        confidence_score: analysis.confidence_score
      });

      res.json({
        success: true,
        message: 'Video analiz edildi',
        data: {
          video_id: updated.test_video_id,
          title: updated.title,
          is_deepfake: updated.is_deepfake,
          confidence_score: updated.confidence_score
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
}

export default VideoLibraryController;
