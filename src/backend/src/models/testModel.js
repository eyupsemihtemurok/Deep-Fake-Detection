import { getConnection, sql } from '../config/database.js';

class TestModel {
  // Tüm test kayıtlarını getir
  static async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .query('SELECT * FROM Tests ORDER BY test_id');
      return result.recordset;
    } catch (error) {
      console.error('Model hatası (getAll):', error);
      throw error;
    }
  }

  // ID'ye göre test kaydı getir
  static async getById(id) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM Tests WHERE test_id = @id');
      return result.recordset[0];
    } catch (error) {
      console.error('Model hatası (getById):', error);
      throw error;
    }
  }

  // Yeni test kaydı oluştur
  static async create(testData) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('test_adi', sql.NVarChar(255), testData.test_adi)
        .query('INSERT INTO Tests (test_adi) OUTPUT INSERTED.* VALUES (@test_adi)');
      return result.recordset[0];
    } catch (error) {
      console.error('Model hatası (create):', error);
      throw error;
    }
  }

  // Test kaydını güncelle
  static async update(id, testData) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .input('test_adi', sql.NVarChar(255), testData.test_adi)
        .query('UPDATE Tests SET test_adi = @test_adi OUTPUT INSERTED.* WHERE test_id = @id');
      return result.recordset[0];
    } catch (error) {
      console.error('Model hatası (update):', error);
      throw error;
    }
  }

  // Test kaydını sil
  static async delete(id) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Tests WHERE test_id = @id');
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Model hatası (delete):', error);
      throw error;
    }
  }
}

export default TestModel;
