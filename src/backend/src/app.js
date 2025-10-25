import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger otomatik yapılandırma
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hackathon Backend API',
      version: '1.0.0',
      description: 'Node.js + MS SQL Backend - Otomatik API Dokümantasyonu',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Route dosyalarını tara
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API Çalışıyor',
    version: '1.0.0',
    endpoints: {
      tests: '/api/tests',
      auth: '/api/auth',
      swagger: '/api-docs'
    }
  });
});

app.use('/api/tests', testRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Bir hata oluştu!',
    message: err.message 
  });
});

export default app;
