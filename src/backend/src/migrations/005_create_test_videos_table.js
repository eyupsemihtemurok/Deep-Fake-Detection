import { getConnection } from '../config/database.js';

export const up = async () => {
  try {
    const pool = await getConnection();
    
    // TestVideos tablosunu oluştur
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='TestVideos' AND xtype='U')
      BEGIN
        CREATE TABLE TestVideos (
          test_video_id INT IDENTITY(1,1) PRIMARY KEY,
          title NVARCHAR(255) NOT NULL,
          thumbnail_url NVARCHAR(500),
          video_url NVARCHAR(500) NOT NULL,
          is_deepfake BIT NULL,
          confidence_score FLOAT,
          created_at DATETIME DEFAULT GETDATE()
        )
      END
    `);
    
    console.log('✅ TestVideos tablosu oluşturuldu');
  } catch (error) {
    console.error('❌ Migration hatası (005_create_test_videos_table):', error);
    throw error;
  }
};

export const down = async () => {
  try {
    const pool = await getConnection();
    
    // TestVideos tablosunu sil
    await pool.request().query(`
      IF EXISTS (SELECT * FROM sysobjects WHERE name='TestVideos' AND xtype='U')
      BEGIN
        DROP TABLE TestVideos
      END
    `);
    
    console.log('✅ TestVideos tablosu silindi');
  } catch (error) {
    console.error('❌ Rollback hatası (005_create_test_videos_table):', error);
    throw error;
  }
};
