import express from 'express';
import AuthController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Kullanıcı adı
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email adresi
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Şifre (minimum 6 karakter)
 *                 example: password123
 *     responses:
 *       201:
 *         description: Kayıt başarılı
 *       400:
 *         description: Geçersiz veri
 *       500:
 *         description: Sunucu hatası
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Kullanıcı girişi
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email adresi
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Şifre
 *                 example: password123
 *     responses:
 *       200:
 *         description: Giriş başarılı
 *       401:
 *         description: Geçersiz email veya şifre
 *       500:
 *         description: Sunucu hatası
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Kullanıcı profil bilgilerini getir
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil bilgileri
 *       401:
 *         description: Yetkisiz erişim
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.get('/me', authMiddleware, AuthController.getProfile);

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Token doğrulama
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token
 *     responses:
 *       200:
 *         description: Token geçerli
 *       401:
 *         description: Geçersiz token
 */
router.post('/verify', AuthController.verifyToken);

export default router;
