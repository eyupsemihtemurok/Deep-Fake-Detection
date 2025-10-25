# Backend - Node.js + MS SQL

Modüler yapıya sahip Node.js backend projesi. MS SQL veritabanı kullanır (Windows Authentication).

## 🚀 Hızlı Başlangıç

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Environment dosyasını oluştur
copy .env.example .env

# 3. Veritabanını oluştur ve migration'ları çalıştır
npm run migrate

# 4. Sunucuyu başlat
npm run dev
```

Backend `http://localhost:3000` adresinde çalışacak.

## 📁 Proje Yapısı

```
src/
├── config/          # Veritabanı bağlantı ayarları
├── controllers/     # İş mantığı
├── models/          # Veri katmanı
├── routes/          # API route'ları
└── migrations/      # Veritabanı migration'ları
```

## 📡 API Endpoints

| Method | URL | Açıklama |
|--------|-----|----------|
| GET | `/api/tests` | Tüm testleri listele |
| GET | `/api/tests/:id` | Tek bir testi getir |
| POST | `/api/tests` | Yeni test oluştur |
| PUT | `/api/tests/:id` | Test güncelle |
| DELETE | `/api/tests/:id` | Test sil |

### Örnek Kullanım

**Tüm testleri getir:**
```
GET http://localhost:3000/api/tests
```

**Yeni test ekle:**
```
POST http://localhost:3000/api/tests
Content-Type: application/json

{
  "test_adi": "Yeni Test"
}
```

## 🗄️ Veritabanı

- **Veritabanı:** HackathonDB
- **Tablo:** Tests (test_id, test_adi, created_at, updated_at)
- **Test Verisi:** Migration ile 5 test verisi otomatik eklenir

## ⚙️ Önemli Notlar

- Windows Authentication kullanılıyor
- ODBC Driver 17 for SQL Server gerekli
- SQL Server servisi çalışıyor olmalı
- Migration'lar otomatik veritabanı oluşturur

### 1. **Config** (`src/config/`)
- Veritabanı bağlantı ayarları
- Connection pool yönetimi
- Yeniden kullanılabilir bağlantı fonksiyonları

### 2. **Models** (`src/models/`)
- Veritabanı ile doğrudan iletişim
- CRUD operasyonları
- SQL sorguları

### 3. **Controllers** (`src/controllers/`)
- İş mantığı
- Request/Response yönetimi
- Validasyon
- Error handling

### 4. **Routes** (`src/routes/`)
- API endpoint tanımlamaları
- HTTP metodları (GET, POST, PUT, DELETE)
- Controller'lara yönlendirme

### 5. **Migrations** (`src/migrations/`)
- Veritabanı şema değişiklikleri
- Seed data (test verileri)
- Geri alma (rollback) özellikleri

## 🔄 İstek Akışı

```
Client Request
    ↓
Routes (testRoutes.js)
    ↓
Controller (testController.js)
    ↓
Model (testModel.js)
    ↓
Database (MS SQL)
    ↓
Response to Client
```

## 🛠️ Geliştirme İpuçları

1. **Yeni bir tablo eklemek için:**
   - Migration dosyası oluştur (`src/migrations/`)
   - Model oluştur (`src/models/`)
   - Controller oluştur (`src/controllers/`)
   - Route oluştur (`src/routes/`)
   - Route'u `app.js`'e ekle

2. **Environment değişkenleri:**
   - Hassas bilgileri `.env` dosyasında sakla
   - `.env` dosyasını asla git'e ekleme

3. **Error Handling:**
   - Her controller'da try-catch kullan
   - Anlamlı hata mesajları döndür
   - HTTP status code'larına dikkat et

## 📦 Bağımlılıklar

- **express**: Web framework
- **mssql**: MS SQL driver
- **dotenv**: Environment variables
- **cors**: Cross-origin resource sharing
- **nodemon**: Development auto-reload (devDependency)

## 🔐 Güvenlik Notları

- `.env` dosyasını git'e eklemeyin
- SQL injection'a karşı parametreli sorgular kullanın
- Production'da `encrypt: true` ayarını kullanın
- Güçlü veritabanı şifreleri kullanın

