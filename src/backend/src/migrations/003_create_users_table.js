import { getConnection } from '../config/database.js';

export const up = async () => {
  try {
    const pool = await getConnection();
    
    // Users tablosunu oluştur
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
      BEGIN
        CREATE TABLE Users (
          user_id INT IDENTITY(1,1) PRIMARY KEY,
          username NVARCHAR(100) UNIQUE NOT NULL,
          email NVARCHAR(255) UNIQUE NOT NULL,
          password_hash NVARCHAR(255) NOT NULL,
          created_at DATETIME DEFAULT GETDATE()
        )
      END
    `);
    
    console.log('✅ Users tablosu oluşturuldu');
  } catch (error) {
    console.error('❌ Migration hatası (003_create_users_table):', error);
    throw error;
  }
};

export const down = async () => {
  try {
    const pool = await getConnection();
    
    // Users tablosunu sil
    await pool.request().query(`
      IF EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
      BEGIN
        DROP TABLE Users
      END
    `);
    
    console.log('✅ Users tablosu silindi');
  } catch (error) {
    console.error('❌ Rollback hatası (003_create_users_table):', error);
    throw error;
  }
};
