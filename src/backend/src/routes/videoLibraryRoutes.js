import express from 'express';
import VideoLibraryController from '../controllers/videoLibraryController.js';

const router = express.Router();

/**
 * @swagger
 * /api/video-library:
 *   get:
 *     summary: Tüm test videolarını listele (rastgele sıralı)
 *     tags: [Video Library]
 *     responses:
 *       200:
 *         description: Video listesi
 */
router.get('/', VideoLibraryController.getAll);

/**
 * @swagger
 * /api/video-library/{id}:
 *   get:
 *     summary: ID ile video getir
 *     tags: [Video Library]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Video bulundu
 *       404:
 *         description: Video bulunamadı
 */
router.get('/:id', VideoLibraryController.getById);

/**
 * @swagger
 * /api/video-library/load-local:
 *   post:
 *     summary: Local dosya sisteminden videoları yükle
 *     tags: [Video Library]
 *     responses:
 *       200:
 *         description: Videolar yüklendi
 */
router.post('/load-local', VideoLibraryController.loadFromLocal);

/**
 * @swagger
 * /api/video-library/analyze-all:
 *   post:
 *     summary: Tüm videoları Hugging Face API ile analiz et
 *     tags: [Video Library]
 *     responses:
 *       200:
 *         description: Analiz tamamlandı
 */
router.post('/analyze-all', VideoLibraryController.analyzeAll);

/**
 * @swagger
 * /api/video-library/analyze/{id}:
 *   post:
 *     summary: Tek bir videoyu analiz et
 *     tags: [Video Library]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Video analiz edildi
 */
router.post('/analyze/:id', VideoLibraryController.analyzeSingle);

export default router;
