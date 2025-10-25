import { getConnection } from '../config/database.js';

export const up = async () => {
  try {
    const pool = await getConnection();
    
    // Test verilerini ekle
    await pool.request().query(`
      -- Mevcut verileri kontrol et ve sadece boşsa ekle
      IF NOT EXISTS (SELECT * FROM Tests)
      BEGIN
        INSERT INTO Tests (test_adi) VALUES 
          (N'Test 1'),
          (N'Test 2'),
          (N'Test 3'),
          (N'Test 4'),
          (N'Test 5')
      END
    `);
    
    console.log('✅ Test verileri eklendi');
  } catch (error) {
    console.error('❌ Seed hatası (002_seed_tests_data):', error);
    throw error;
  }
};

export const down = async () => {
  try {
    const pool = await getConnection();
    
    // Test verilerini sil
    await pool.request().query(`
      DELETE FROM Tests WHERE test_adi IN (N'Test 1', N'Test 2', N'Test 3', N'Test 4', N'Test 5')
    `);
    
    console.log('✅ Test verileri silindi');
  } catch (error) {
    console.error('❌ Rollback hatası (002_seed_tests_data):', error);
    throw error;
  }
};
