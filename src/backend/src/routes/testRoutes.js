import express from 'express';
import TestController from '../controllers/testController.js';

const router = express.Router();

/**
 * @swagger
 * /api/tests:
 *   get:
 *     summary: Tüm testleri listele
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.get('/', TestController.getAll);

/**
 * @swagger
 * /api/tests/{id}:
 *   get:
 *     summary: ID ile test getir
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Başarılı
 */
router.get('/:id', TestController.getById);

/**
 * @swagger
 * /api/tests:
 *   post:
 *     summary: Yeni test oluştur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               test_adi:
 *                 type: string
 *     responses:
 *       201:
 *         description: Oluşturuldu
 */
router.post('/', TestController.create);

/**
 * @swagger
 * /api/tests/{id}:
 *   put:
 *     summary: Test güncelle
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               test_adi:
 *                 type: string
 *     responses:
 *       200:
 *         description: Güncellendi
 */
router.put('/:id', TestController.update);

/**
 * @swagger
 * /api/tests/{id}:
 *   delete:
 *     summary: Test sil
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Silindi
 */
router.delete('/:id', TestController.delete);

export default router;
