import express from 'express';

const router = express.Router();

/*
// 🚫 YORUM SATIRINDA - Detection API'si geç için ayırıldı
// Kendi eğittiğimiz model kullanacağız

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload klasörü ayarla
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Image detection endpoint
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Resim yüklenmedi'
      });
    }

    const imagePath = req.file.path;
    const result = await runPythonDetection(imagePath, 'image');
    fs.unlinkSync(imagePath);
    res.json(result);
  } catch (error) {
    console.error('Detection error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Video detection endpoint
router.post('/video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Video yüklenmedi'
      });
    }

    const videoPath = req.file.path;
    const result = await runPythonDetection(videoPath, 'video');
    fs.unlinkSync(videoPath);
    res.json(result);
  } catch (error) {
    console.error('Detection error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Status endpoint
router.get('/status', (req, res) => {
  const modelPath = path.join(__dirname, '..', 'models', 'deepfake_detector_best.pth');
  const modelExists = fs.existsSync(modelPath);

  res.json({
    success: true,
    model_loaded: modelExists,
    model_path: modelPath,
    model_size: modelExists ? fs.statSync(modelPath).size / (1024 * 1024) + ' MB' : 'N/A',
    timestamp: new Date()
  });
});

// Helper function
function runPythonDetection(filePath, fileType) {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(__dirname, '..', 'models', 'localDetector.py');
    const python = spawn('python', [pythonScriptPath, fileType, filePath]);

    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script error: ${errorOutput}`));
      } else {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (e) {
          reject(new Error(`Failed to parse Python output: ${output}`));
        }
      }
    });

    python.on('error', (err) => {
      reject(err);
    });
  });
}
*/

export default router;
