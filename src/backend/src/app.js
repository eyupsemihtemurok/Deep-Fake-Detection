import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import testRoutes from './routes/testRoutes.js';

const app = express();

// Swagger dokümantasyonu (Otomatik)
const swaggerDocument = {
  swagger: '2.0',
  info: {
    title: 'Hackathon Backend API',
    description: 'Node.js + MS SQL Backend API',
    version: '1.0.0',
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http'],
  paths: {
    '/api/tests': {
      get: {
        tags: ['Tests'],
        summary: 'Tüm testleri listele',
        responses: {
          200: { description: 'Başarılı' }
        }
      },
      post: {
        tags: ['Tests'],
        summary: 'Yeni test oluştur',
        parameters: [{
          in: 'body',
          name: 'body',
          schema: {
            type: 'object',
            properties: {
              test_adi: { type: 'string', example: 'Test 6' }
            }
          }
        }],
        responses: {
          201: { description: 'Oluşturuldu' }
        }
      }
    },
    '/api/tests/{id}': {
      get: {
        tags: ['Tests'],
        summary: 'ID ile test getir',
        parameters: [{
          in: 'path',
          name: 'id',
          required: true,
          type: 'integer'
        }],
        responses: {
          200: { description: 'Başarılı' }
        }
      },
      put: {
        tags: ['Tests'],
        summary: 'Test güncelle',
        parameters: [{
          in: 'path',
          name: 'id',
          required: true,
          type: 'integer'
        }, {
          in: 'body',
          name: 'body',
          schema: {
            type: 'object',
            properties: {
              test_adi: { type: 'string', example: 'Güncellenmiş Test' }
            }
          }
        }],
        responses: {
          200: { description: 'Güncellendi' }
        }
      },
      delete: {
        tags: ['Tests'],
        summary: 'Test sil',
        parameters: [{
          in: 'path',
          name: 'id',
          required: true,
          type: 'integer'
        }],
        responses: {
          200: { description: 'Silindi' }
        }
      }
    }
  }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API Çalışıyor',
    version: '1.0.0',
    endpoints: {
      tests: '/api/tests',
      swagger: '/api-docs'
    }
  });
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'Hackathon API',
  customCss: '.swagger-ui .topbar { display: none }'
}));

app.use('/api/tests', testRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Bir hata oluştu!',
    message: err.message 
  });
});

export default app;
