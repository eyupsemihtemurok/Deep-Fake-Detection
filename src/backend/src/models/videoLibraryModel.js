import { getConnection, sql } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class VideoLibraryModel {
  // Tüm test videolarını getir
  static async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .query('SELECT * FROM TestVideos ORDER BY created_at DESC');
      return result.recordset;
    } catch (error) {
      console.error('Model hatası (getAll):', error);
      throw error;
    }
  }

  // ID'ye göre video getir
  static async getById(id) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM TestVideos WHERE test_video_id = @id');
      return result.recordset[0];
    } catch (error) {
      console.error('Model hatası (getById):', error);
      throw error;
    }
  }

  // Yeni video ekle
  static async create(videoData) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('title', sql.NVarChar(255), videoData.title)
        .input('thumbnail_url', sql.NVarChar(500), videoData.thumbnail_url)
        .input('video_url', sql.NVarChar(500), videoData.video_url)
        .input('is_deepfake', sql.Bit, videoData.is_deepfake)
        .input('confidence_score', sql.Float, videoData.confidence_score)
        .query(`
          INSERT INTO TestVideos (title, thumbnail_url, video_url, is_deepfake, confidence_score)
          OUTPUT INSERTED.*
          VALUES (@title, @thumbnail_url, @video_url, @is_deepfake, @confidence_score)
        `);
      return result.recordset[0];
    } catch (error) {
      console.error('Model hatası (create):', error);
      throw error;
    }
  }

  // Video güncelle (analiz sonuçları için)
  static async updateAnalysis(id, analysisData) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .input('is_deepfake', sql.Bit, analysisData.is_deepfake)
        .input('confidence_score', sql.Float, analysisData.confidence_score)
        .query(`
          UPDATE TestVideos 
          SET is_deepfake = @is_deepfake, 
              confidence_score = @confidence_score
          OUTPUT INSERTED.*
          WHERE test_video_id = @id
        `);
      return result.recordset[0];
    } catch (error) {
      console.error('Model hatası (updateAnalysis):', error);
      throw error;
    }
  }

  // Tüm videoları sil
  static async deleteAll() {
    try {
      const pool = await getConnection();
      await pool.request().query('DELETE FROM TestVideos');
      return { success: true };
    } catch (error) {
      console.error('Model hatası (deleteAll):', error);
      throw error;
    }
  }

  // Local dosya sisteminden videoları yükle
  static async loadFromLocal() {
    try {
      const datasetPath = path.join(__dirname, '../../../YapayZeka/dataset');
      const fakeVideosPath = path.join(datasetPath, 'DFD_manipulated_sequences/DFD_manipulated_sequences');
      const realVideosPath = path.join(datasetPath, 'DFD_original sequences');

      const videos = [];
      let allFakeFiles = [];
      let allRealFiles = [];

      // Fake videoları listele
      if (fs.existsSync(fakeVideosPath)) {
        allFakeFiles = fs.readdirSync(fakeVideosPath)
          .filter(file => file.endsWith('.mp4') || file.endsWith('.avi') || file.endsWith('.mov'));
      }

      // Real videoları listele
      if (fs.existsSync(realVideosPath)) {
        allRealFiles = fs.readdirSync(realVideosPath)
          .filter(file => file.endsWith('.mp4') || file.endsWith('.avi') || file.endsWith('.mov'));
      }

      // En az 1 gerçek ve 1 deepfake olmak üzere toplam 6 video seç
      // Random olarak 1-5 arasında fake video seç
      const numFakeVideos = Math.max(1, Math.min(5, Math.floor(Math.random() * 5) + 1));
      const numRealVideos = 6 - numFakeVideos; // Kalan sayı gerçek video olacak

      // Random fake videolar seç
      const selectedFakeFiles = allFakeFiles
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(numFakeVideos, allFakeFiles.length));

      // Random real videolar seç
      const selectedRealFiles = allRealFiles
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(numRealVideos, allRealFiles.length));

      // Fake videoları ekle
      for (const file of selectedFakeFiles) {
        const videoData = {
          title: `Video - ${file}`,
          video_url: `/videos/fake/${file}`,
          thumbnail_url: null,
          is_deepfake: null,  // Analiz edilene kadar null
          confidence_score: null
        };
        const created = await this.create(videoData);
        videos.push(created);
      }

      // Real videoları ekle
      for (const file of selectedRealFiles) {
        const videoData = {
          title: `Video - ${file}`,
          video_url: `/videos/real/${file}`,
          thumbnail_url: null,
          is_deepfake: null,  // Analiz edilene kadar null
          confidence_score: null
        };
        const created = await this.create(videoData);
        videos.push(created);
      }

      // Videoları karıştır
      videos.sort(() => Math.random() - 0.5);

      return videos;
    } catch (error) {
      console.error('Model hatası (loadFromLocal):', error);
      throw error;
    }
  }
}

export default VideoLibraryModel;
