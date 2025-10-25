import app from './src/app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📡 API Endpoints:`);
  console.log(`   GET    http://localhost:${PORT}/api/tests`);
  console.log(`   GET    http://localhost:${PORT}/api/tests/:id`);
  console.log(`   POST   http://localhost:${PORT}/api/tests`);
  console.log(`   PUT    http://localhost:${PORT}/api/tests/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/tests/:id`);
});
