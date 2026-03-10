# 🔍 Deep Fake Detection — Eternal Coders

<div align="center">
  <img src="./eternal_coders_logo.png" alt="Eternal Coders Logo" width="200"/>

  <br/>

  [![Node.js](https://img.shields.io/badge/Node.js-22.x-green?logo=node.js)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
  [![HuggingFace](https://img.shields.io/badge/HuggingFace-API-yellow?logo=huggingface)](https://huggingface.co/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-purple)](LICENSE)
</div>

---

## 🇬🇧 English

### Overview

**Deep Fake Detection** is a full-stack web application developed by **Eternal Coders** for the Hackathon. The system detects whether a given video or image is a deepfake using a **custom-trained AI model** as the primary engine, with the **HuggingFace Inference API** as a fallback.

### Dataset

The model was trained on the **Deep Fake Detection (DFD) — Entire Original Dataset** from Kaggle:

> 📦 [DFD Original Sequences — Kaggle](https://www.kaggle.com/datasets/sanikatiwarekar/deep-fake-detection-dfd-entire-original-dataset/data?select=DFD_original+sequences)

This dataset contains original (real) video sequences that were used to train the binary classification model to distinguish authentic content from AI-generated fakes.

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + React Router |
| Backend | Node.js + Express + MS SQL Server |
| AI (Primary) | Custom-trained deep learning model (YapayZeka) |
| AI (Fallback) | HuggingFace Inference API |
| Auth | JWT + bcrypt |
| API Docs | Swagger / OpenAPI |

### Project Structure

```
Deep-Fake-Detection/
├── src/
│   ├── Frontend/          # React application (Vite)
│   │   ├── src/           # Components, pages, hooks
│   │   └── public/        # Static assets
│   ├── backend/           # Node.js / Express REST API
│   │   ├── src/           # Routes, controllers, middleware
│   │   └── server.js      # Entry point
│   └── YapayZeka/         # AI / ML layer
│       ├── HuggingFace/   # HuggingFace API integration (fallback)
│       ├── GeminiApi/     # Gemini API integration
│       ├── dataset/       # Training data (gitignored)
│       └── other/         # Utilities & experiments
└── README.md
```

### Getting Started

#### 1. Backend

```bash
cd src/backend
cp .env.example .env    # Fill in your credentials
npm install
npm run dev             # Starts on http://localhost:3000
```

#### 2. Frontend

```bash
cd src/Frontend
npm install
npm run dev             # Starts on http://localhost:5173
```

#### 3. HuggingFace Fallback

```bash
cd src/YapayZeka/HuggingFace
npm install
# Set HUGGINGFACE_API_KEY in your environment
node deepfakeAPI.js
```

### Environment Variables

Copy `src/backend/.env.example` to `src/backend/.env` and fill in:

```env
PORT=3000
DB_SERVER=...
DB_DATABASE=...
DB_USER=...
DB_PASSWORD=...
JWT_SECRET=...
HUGGINGFACE_API_KEY=...
```

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user info |
| GET | `/api/tests` | List detection results |
| POST | `/api/tests` | Submit media for analysis |

Full documentation: `http://localhost:3000/api-docs`

### 👥 Team — Eternal Coders

| Name | GitHub |
|---|---|
| Tolga Çınar | [@thaldore](https://github.com/thaldore) |
| Mete Yılmaz | [@meteyMnst](https://github.com/meteyMnst) |
| Eyüp Semih Temurok | [@eyupsemihtemurok](https://github.com/eyupsemihtemurok) |
| Sedat Eroğlu | [@sedaterogluu](https://github.com/sedaterogluu) |

---

## 🇹🇷 Türkçe

### Genel Bakış

**Deep Fake Detection**, **Eternal Coders** ekibi tarafından Hackathon için geliştirilen tam yığın (full-stack) bir web uygulamasıdır. Sistem, verilen bir video veya görüntünün deepfake olup olmadığını tespit eder. Birincil motor olarak **özel eğitilmiş yapay zeka modelimiz** kullanılmakta; model erişilemez olduğunda **HuggingFace Inference API** yedek olarak devreye girmektedir.

### Veri Seti

Model, Kaggle üzerindeki **Deep Fake Detection (DFD) — Tüm Orijinal Veri Seti** ile eğitilmiştir:

> 📦 [DFD Orijinal Dizileri — Kaggle](https://www.kaggle.com/datasets/sanikatiwarekar/deep-fake-detection-dfd-entire-original-dataset/data?select=DFD_original+sequences)

Bu veri seti, gerçek video dizilerini içermektedir ve ikili sınıflandırma modelinin özgün içeriği yapay zeka üretimli sahte içerikten ayırt etmesini öğrenmesi için kullanılmıştır.

### Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Arayüz (Frontend) | React 19 + Vite + React Router |
| Sunucu (Backend) | Node.js + Express + MS SQL Server |
| Yapay Zeka (Birincil) | Özel eğitilmiş derin öğrenme modeli (YapayZeka) |
| Yapay Zeka (Yedek) | HuggingFace Inference API |
| Kimlik Doğrulama | JWT + bcrypt |
| API Dokümantasyonu | Swagger / OpenAPI |

### Proje Yapısı

```
Deep-Fake-Detection/
├── src/
│   ├── Frontend/          # React uygulaması (Vite)
│   │   ├── src/           # Bileşenler, sayfalar, hook'lar
│   │   └── public/        # Statik dosyalar
│   ├── backend/           # Node.js / Express REST API
│   │   ├── src/           # Route'lar, controller'lar, middleware
│   │   └── server.js      # Giriş noktası
│   └── YapayZeka/         # Yapay Zeka / Makine Öğrenimi katmanı
│       ├── HuggingFace/   # HuggingFace API entegrasyonu (yedek)
│       ├── GeminiApi/     # Gemini API entegrasyonu
│       ├── dataset/       # Eğitim verisi (gitignore ile hariç tutulmuş)
│       └── other/         # Yardımcı araçlar ve denemeler
└── README.md
```

### Başlarken

#### 1. Backend

```bash
cd src/backend
cp .env.example .env    # Kimlik bilgilerinizi girin
npm install
npm run dev             # http://localhost:3000 adresinde başlar
```

#### 2. Frontend

```bash
cd src/Frontend
npm install
npm run dev             # http://localhost:5173 adresinde başlar
```

#### 3. HuggingFace Yedek Servisi

```bash
cd src/YapayZeka/HuggingFace
npm install
# HUGGINGFACE_API_KEY ortam değişkenini ayarlayın
node deepfakeAPI.js
```

### Ortam Değişkenleri

`src/backend/.env.example` dosyasını `src/backend/.env` olarak kopyalayın ve doldurun:

```env
PORT=3000
DB_SERVER=...
DB_DATABASE=...
DB_USER=...
DB_PASSWORD=...
JWT_SECRET=...
HUGGINGFACE_API_KEY=...
```

### API Uç Noktaları

| Metot | Uç Nokta | Açıklama |
|---|---|---|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı |
| POST | `/api/auth/login` | Giriş |
| GET | `/api/auth/me` | Mevcut kullanıcı bilgisi |
| GET | `/api/tests` | Tespit sonuçlarını listele |
| POST | `/api/tests` | Analiz için medya gönder |

Tam dokümantasyon: `http://localhost:3000/api-docs`

### 👥 Ekip — Eternal Coders

| İsim | GitHub |
|---|---|
| Tolga Çınar | [@thaldore](https://github.com/thaldore) |
| Mete Yılmaz | [@meteyMnst](https://github.com/meteyMnst) |
| Eyüp Semih Temurok | [@eyupsemihtemurok](https://github.com/eyupsemihtemurok) |
| Sedat Eroğlu | [@sedaterogluu](https://github.com/sedaterogluu) |

---

<div align="center">
  <sub>Built with ❤️ by <strong>Eternal Coders</strong> — 2025 Hackathon</sub>
</div>