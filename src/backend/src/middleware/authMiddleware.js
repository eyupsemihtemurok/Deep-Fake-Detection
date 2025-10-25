import jwt from 'jsonwebtoken';

// Token doğrulama middleware
export const authMiddleware = (req, res, next) => {
  try {
    // Header'dan token al
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token bulunamadı. Lütfen giriş yapınız.'
      });
    }

    const token = authHeader.substring(7); // "Bearer " kısmını çıkar

    // Token'ı doğrula
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'hackathon-secret-key-2025'
    );

    // Kullanıcı bilgilerini request'e ekle
    req.user = {
      userId: decoded.userId,
      username: decoded.username
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token süresi dolmuş. Lütfen tekrar giriş yapınız.'
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Geçersiz token'
    });
  }
};

// Opsiyonel auth middleware (token varsa doğrula, yoksa devam et)
export const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'hackathon-secret-key-2025'
      );
      
      req.user = {
        userId: decoded.userId,
        username: decoded.username
      };
    }

    next();
  } catch (error) {
    // Token geçersiz olsa bile devam et
    next();
  }
};
