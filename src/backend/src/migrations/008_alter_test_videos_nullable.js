import { getConnection } from '../config/database.js';

export const up = async () => {
  try {
    const pool = await getConnection();
    
    // is_deepfake kolonunu NULL kabul edecek şekilde değiştir
    await pool.request().query(`
      IF EXISTS (SELECT * FROM sysobjects WHERE name='TestVideos' AND xtype='U')
      BEGIN
        ALTER TABLE TestVideos
        ALTER COLUMN is_deepfake BIT NULL
      END
    `);
    
    console.log('✅ TestVideos tablosu güncellendi - is_deepfake NULL kabul ediyor');
  } catch (error) {
    console.error('❌ Migration hatası (008_alter_test_videos_nullable):', error);
    throw error;
  }
};

export const down = async () => {
  try {
    const pool = await getConnection();
    
    // is_deepfake kolonunu NOT NULL yap (geri al)
    await pool.request().query(`
      IF EXISTS (SELECT * FROM sysobjects WHERE name='TestVideos' AND xtype='U')
      BEGIN
        ALTER TABLE TestVideos
        ALTER COLUMN is_deepfake BIT NOT NULL
      END
    `);
    
    console.log('✅ TestVideos tablosu eski haline döndü - is_deepfake NOT NULL');
  } catch (error) {
    console.error('❌ Rollback hatası (008_alter_test_videos_nullable):', error);
    throw error;
  }
};
