import { getConnection, sql } from '../config/database.js';

class AuthModel {
  // Email ile kullanıcı bul
  static async findByEmail(email) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('email', sql.NVarChar(255), email)
        .query('SELECT * FROM Users WHERE email = @email');
      return result.recordset[0];
    } catch (error) {
      console.error('Model hatası (findByEmail):', error);
      throw error;
    }
  }

  // Username ile kullanıcı bul
  static async findByUsername(username) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('username', sql.NVarChar(100), username)
        .query('SELECT * FROM Users WHERE username = @username');
      return result.recordset[0];
    } catch (error) {
      console.error('Model hatası (findByUsername):', error);
      throw error;
    }
  }

  // Yeni kullanıcı oluştur
  static async create(userData) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('username', sql.NVarChar(100), userData.username)
        .input('email', sql.NVarChar(255), userData.email)
        .input('password_hash', sql.NVarChar(255), userData.password_hash)
        .query(`
          INSERT INTO Users (username, email, password_hash)
          OUTPUT INSERTED.*
          VALUES (@username, @email, @password_hash)
        `);
      return result.recordset[0];
    } catch (error) {
      console.error('Model hatası (create):', error);
      throw error;
    }
  }

  // ID'ye göre kullanıcı bul
  static async findById(userId) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('user_id', sql.Int, userId)
        .query('SELECT user_id, username, email, created_at FROM Users WHERE user_id = @user_id');
      return result.recordset[0];
    } catch (error) {
      console.error('Model hatası (findById):', error);
      throw error;
    }
  }

  // Tüm kullanıcıları getir (admin için)
  static async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .query('SELECT user_id, username, email, created_at FROM Users ORDER BY created_at DESC');
      return result.recordset;
    } catch (error) {
      console.error('Model hatası (getAll):', error);
      throw error;
    }
  }
}

export default AuthModel;
