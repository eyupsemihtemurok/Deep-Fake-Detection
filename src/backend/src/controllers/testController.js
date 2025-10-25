import TestModel from '../models/testModel.js';

class TestController {
  // Tüm testleri getir - GET /api/tests
  static async getAll(req, res) {
    try {
      const tests = await TestModel.getAll();
      res.json({
        success: true,
        count: tests.length,
        data: tests
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Testler getirilirken hata oluştu',
        message: error.message
      });
    }
  }

  // ID'ye göre test getir - GET /api/tests/:id
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const test = await TestModel.getById(id);
      
      if (!test) {
        return res.status(404).json({
          success: false,
          error: 'Test bulunamadı'
        });
      }

      res.json({
        success: true,
        data: test
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Test getirilirken hata oluştu',
        message: error.message
      });
    }
  }

  // Yeni test oluştur - POST /api/tests
  static async create(req, res) {
    try {
      const { test_adi } = req.body;

      if (!test_adi) {
        return res.status(400).json({
          success: false,
          error: 'test_adi alanı gereklidir'
        });
      }

      const newTest = await TestModel.create({ test_adi });
      res.status(201).json({
        success: true,
        message: 'Test başarıyla oluşturuldu',
        data: newTest
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Test oluşturulurken hata oluştu',
        message: error.message
      });
    }
  }

  // Test güncelle - PUT /api/tests/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { test_adi } = req.body;

      if (!test_adi) {
        return res.status(400).json({
          success: false,
          error: 'test_adi alanı gereklidir'
        });
      }

      const updatedTest = await TestModel.update(id, { test_adi });
      
      if (!updatedTest) {
        return res.status(404).json({
          success: false,
          error: 'Test bulunamadı'
        });
      }

      res.json({
        success: true,
        message: 'Test başarıyla güncellendi',
        data: updatedTest
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Test güncellenirken hata oluştu',
        message: error.message
      });
    }
  }

  // Test sil - DELETE /api/tests/:id
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await TestModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Test bulunamadı'
        });
      }

      res.json({
        success: true,
        message: 'Test başarıyla silindi'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Test silinirken hata oluştu',
        message: error.message
      });
    }
  }
}

export default TestController;
