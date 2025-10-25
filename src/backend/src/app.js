import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/authRoutes.js';
import videoLibraryRoutes from './routes/videoLibraryRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Serve video files statically
const datasetPath = path.join(__dirname, '../../YapayZeka/dataset');
app.use('/videos/fake', express.static(path.join(datasetPath, 'DFD_manipulated_sequences/DFD_manipulated_sequences')));
app.use('/videos/real', express.static(path.join(datasetPath, 'DFD_original sequences')));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API Çalışıyor',
    version: '1.0.0',
    endpoints: {
      tests: '/api/tests',
      auth: '/api/auth',
      videoLibrary: '/api/video-library',
      swagger: '/api-docs'
    }
  });
});

app.use('/api/tests', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/video-library', videoLibraryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Bir hata oluştu!',
    message: err.message 
  });
});

export default app;
