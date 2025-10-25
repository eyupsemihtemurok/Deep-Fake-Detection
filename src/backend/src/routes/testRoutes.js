import express from 'express';
import TestController from '../controllers/testController.js';

const router = express.Router();

// Test CRUD işlemleri
router.get('/', TestController.getAll);
router.get('/:id', TestController.getById);
router.post('/', TestController.create);
router.put('/:id', TestController.update);
router.delete('/:id', TestController.delete);

export default router;
