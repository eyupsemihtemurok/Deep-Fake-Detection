# AUTH SİSTEMİ TEST KOMUTALRI

## 1. Kayıt Ol (Register)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"username":"testuser","email":"test@example.com","password":"test123"}'
```

## 2. Giriş Yap (Login)
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"test@example.com","password":"test123"}'
$token = $response.token
Write-Host "Token: $token"
```

## 3. Profil Getir (Token ile)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/me" -Method GET -Headers @{"Authorization"="Bearer $token"}
```

## 4. Token Doğrula
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/verify" -Method POST -Headers @{"Content-Type"="application/json"} -Body "{`"token`":`"$token`"}"
```

## Frontend Test
1. Tarayıcıda http://localhost:5173 adresine git
2. Sidebar'daki "Giriş Yap / Kayıt Ol" butonuna tıkla
3. "Kayıt Ol" sekmesinden yeni kullanıcı oluştur
4. Email ve şifre ile giriş yap
5. Profil bilgilerinin göründüğünü kontrol et
