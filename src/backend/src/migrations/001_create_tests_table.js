import { getConnection } from '../config/database.js';

export const up = async () => {
  try {
    const pool = await getConnection();
    
    // Tests tablosunu oluştur
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tests' AND xtype='U')
      BEGIN
        CREATE TABLE Tests (
          test_id INT IDENTITY(1,1) PRIMARY KEY,
          test_adi NVARCHAR(255) NOT NULL,
          created_at DATETIME DEFAULT GETDATE(),
          updated_at DATETIME DEFAULT GETDATE()
        )
      END
    `);
    
    console.log('✅ Tests tablosu oluşturuldu');
  } catch (error) {
    console.error('❌ Migration hatası (001_create_tests_table):', error);
    throw error;
  }
};

export const down = async () => {
  try {
    const pool = await getConnection();
    
    // Tests tablosunu sil
    await pool.request().query(`
      IF EXISTS (SELECT * FROM sysobjects WHERE name='Tests' AND xtype='U')
      BEGIN
        DROP TABLE Tests
      END
    `);
    
    console.log('✅ Tests tablosu silindi');
  } catch (error) {
    console.error('❌ Rollback hatası (001_create_tests_table):', error);
    throw error;
  }
};
