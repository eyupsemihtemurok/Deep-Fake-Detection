import express from 'express';
import TestController from '../controllers/testController.js';

const router = express.Router();

// Test CRUD işlemleri
router.get('/', TestController.getAll);           // Tüm testleri getir
router.get('/:id', TestController.getById);       // ID'ye göre test getir
router.post('/', TestController.create);          // Yeni test oluştur
router.put('/:id', TestController.update);        // Test güncelle
router.delete('/:id', TestController.delete);     // Test sil

export default router;
