import { getConnection } from '../config/database.js';

export const up = async () => {
  try {
    const pool = await getConnection();
    
    // UploadedVideos tablosunu oluştur
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UploadedVideos' AND xtype='U')
      BEGIN
        CREATE TABLE UploadedVideos (
          video_id INT IDENTITY(1,1) PRIMARY KEY,
          user_id INT NOT NULL,
          video_url NVARCHAR(500) NOT NULL,
          file_name NVARCHAR(255) NOT NULL,
          analysis_status NVARCHAR(50) DEFAULT 'pending',
          is_deepfake BIT NULL,
          confidence_score FLOAT NULL,
          uploaded_at DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
        )
      END
    `);
    
    console.log('✅ UploadedVideos tablosu oluşturuldu');
  } catch (error) {
    console.error('❌ Migration hatası (004_create_uploaded_videos_table):', error);
    throw error;
  }
};

export const down = async () => {
  try {
    const pool = await getConnection();
    
    // UploadedVideos tablosunu sil
    await pool.request().query(`
      IF EXISTS (SELECT * FROM sysobjects WHERE name='UploadedVideos' AND xtype='U')
      BEGIN
        DROP TABLE UploadedVideos
      END
    `);
    
    console.log('✅ UploadedVideos tablosu silindi');
  } catch (error) {
    console.error('❌ Rollback hatası (004_create_uploaded_videos_table):', error);
    throw error;
  }
};
