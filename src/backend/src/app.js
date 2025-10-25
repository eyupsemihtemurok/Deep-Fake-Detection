import express from 'express';
import cors from 'cors';
import testRoutes from './routes/testRoutes.js';

const app = express();

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
      tests: '/api/tests'
    }
  });
});

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
