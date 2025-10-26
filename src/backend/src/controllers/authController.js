import AuthModel from '../models/authModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthController {
  // Kayıt olma - POST /api/auth/register
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Validasyon
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Tüm alanlar gereklidir (username, email, password)'
        });
      }

      // Email formatı kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Geçerli bir email adresi giriniz'
        });
      }

      // Şifre uzunluğu kontrolü
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'Şifre en az 6 karakter olmalıdır'
        });
      }

      // Email kontrolü
      const existingEmail = await AuthModel.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          error: 'Bu email adresi zaten kullanılıyor'
        });
      }

      // Username kontrolü
      const existingUsername = await AuthModel.findByUsername(username);
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          error: 'Bu kullanıcı adı zaten kullanılıyor'
        });
      }

      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(password, 10);

      // Kullanıcıyı oluştur
      const user = await AuthModel.create({
        username,
        email,
        password_hash: hashedPassword
      });

      // JWT token oluştur
      const token = jwt.sign(
        { userId: user.user_id, username: user.username },
        process.env.JWT_SECRET || 'hackathon-secret-key-2025',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Kayıt başarılı',
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          created_at: user.created_at
        }
      });
    } catch (error) {
      console.error('Kayıt hatası:', error);
      res.status(500).json({
        success: false,
        error: 'Kayıt sırasında hata oluştu',
        message: error.message
      });
    }
  }

  // Giriş yapma - POST /api/auth/login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validasyon
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email ve şifre gereklidir'
        });
      }

      // Kullanıcıyı bul
      const user = await AuthModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Geçersiz email veya şifre'
        });
      }

      // Şifre kontrolü
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Geçersiz email veya şifre'
        });
      }

      // JWT token oluştur
      const token = jwt.sign(
        { userId: user.user_id, username: user.username },
        process.env.JWT_SECRET || 'hackathon-secret-key-2025',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Giriş başarılı',
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          created_at: user.created_at
        }
      });
    } catch (error) {
      console.error('Giriş hatası:', error);
      res.status(500).json({
        success: false,
        error: 'Giriş sırasında hata oluştu',
        message: error.message
      });
    }
  }

  // Kullanıcı profilini getir - GET /api/auth/me
  static async getProfile(req, res) {
    try {
      const userId = req.user.userId; // Middleware'den gelecek
      
      const user = await AuthModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Kullanıcı bulunamadı'
        });
      }

      res.json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Profil hatası:', error);
      res.status(500).json({
        success: false,
        error: 'Profil bilgisi alınırken hata oluştu',
        message: error.message
      });
    }
  }

  // Token doğrulama - POST /api/auth/verify
  static async verifyToken(req, res) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Token gereklidir'
        });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'hackathon-secret-key-2025'
      );

      const user = await AuthModel.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Kullanıcı bulunamadı'
        });
      }

      res.json({
        success: true,
        valid: true,
        user
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        valid: false,
        error: 'Geçersiz token'
      });
    }
  }
}

export default AuthController;
