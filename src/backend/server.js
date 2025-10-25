import app from './src/app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log(`📡 API Endpoints:`);
  console.log(`\n🔐 Auth:`);
  console.log(`   POST   http://localhost:${PORT}/api/auth/register`);
  console.log(`   POST   http://localhost:${PORT}/api/auth/login`);
  console.log(`   GET    http://localhost:${PORT}/api/auth/me`);
  console.log(`   POST   http://localhost:${PORT}/api/auth/verify`);
  console.log(`\n📝 Tests:`);
  console.log(`   GET    http://localhost:${PORT}/api/tests`);
  console.log(`   GET    http://localhost:${PORT}/api/tests/:id`);
  console.log(`   POST   http://localhost:${PORT}/api/tests`);
  console.log(`   PUT    http://localhost:${PORT}/api/tests/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/tests/:id`);
});
