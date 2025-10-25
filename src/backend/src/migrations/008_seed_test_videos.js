# Video Kütüphanesi Seed Data
# Bu migration test videoları oluşturur

import { getConnection, sql } from '../config/database.js';

export const up = async () => {
  try {
    const pool = await getConnection();
    
    // Önce mevcut test videolarını sil
    await pool.request().query('DELETE FROM TestVideos');
    
    // 3 Deepfake video ekle
    await pool.request().query(`
      INSERT INTO TestVideos (title, video_url, thumbnail_url, is_deepfake, confidence_score) VALUES
      (N'Manipulated Video 001', '/videos/fake/video1.mp4', NULL, NULL, NULL),
      (N'Manipulated Video 002', '/videos/fake/video2.mp4', NULL, NULL, NULL),
      (N'Manipulated Video 003', '/videos/fake/video3.mp4', NULL, NULL, NULL)
    `);
    
    // 3 Gerçek video ekle
    await pool.request().query(`
      INSERT INTO TestVideos (title, video_url, thumbnail_url, is_deepfake, confidence_score) VALUES
      (N'Original Video 001', '/videos/real/video1.mp4', NULL, NULL, NULL),
      (N'Original Video 002', '/videos/real/video2.mp4', NULL, NULL, NULL),
      (N'Original Video 003', '/videos/real/video3.mp4', NULL, NULL, NULL)
    `);
    
    console.log('✅ Test videoları eklendi (6 video)');
  } catch (error) {
    console.error('❌ Seed hatası:', error);
    throw error;
  }
};

export const down = async () => {
  try {
    const pool = await getConnection();
    await pool.request().query('DELETE FROM TestVideos');
    console.log('✅ Test videoları silindi');
  } catch (error) {
    console.error('❌ Rollback hatası:', error);
    throw error;
  }
};
