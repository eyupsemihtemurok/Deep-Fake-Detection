import { getConnection } from '../config/database.js';

export const up = async () => {
  try {
    const pool = await getConnection();
    
    // SocialPosts tablosunu oluştur
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SocialPosts' AND xtype='U')
      BEGIN
        CREATE TABLE SocialPosts (
          post_id INT IDENTITY(1,1) PRIMARY KEY,
          user_id INT NOT NULL,
          content_text NVARCHAR(MAX),
          media_url NVARCHAR(500),
          media_type NVARCHAR(20),
          is_deepfake BIT NULL,
          is_fact_checked BIT NULL,
          fact_check_result NVARCHAR(50),
          created_at DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
        )
      END
    `);
    
    console.log('✅ SocialPosts tablosu oluşturuldu');
  } catch (error) {
    console.error('❌ Migration hatası (006_create_social_posts_table):', error);
    throw error;
  }
};

export const down = async () => {
  try {
    const pool = await getConnection();
    
    // SocialPosts tablosunu sil
    await pool.request().query(`
      IF EXISTS (SELECT * FROM sysobjects WHERE name='SocialPosts' AND xtype='U')
      BEGIN
        DROP TABLE SocialPosts
      END
    `);
    
    console.log('✅ SocialPosts tablosu silindi');
  } catch (error) {
    console.error('❌ Rollback hatası (006_create_social_posts_table):', error);
    throw error;
  }
};
