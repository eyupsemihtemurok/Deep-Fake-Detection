import dotenv from 'dotenv';
import sql from 'mssql/msnodesqlv8.js';

dotenv.config();

// Master veritabanına bağlanmak için connection string
const getMasterConfig = () => ({
  connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=localhost;Database=master;Trusted_Connection=yes;'
});

// Hedef veritabanına bağlanmak için connection string
const getTargetConfig = () => ({
  connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=localhost;Database=${process.env.DB_DATABASE || 'HackathonDB'};Trusted_Connection=yes;`
});

const createDatabase = async () => {
  let masterPool = null;
  try {
    const dbName = process.env.DB_DATABASE || 'HackathonDB';
    console.log(`� Veritabanı kontrolü: ${dbName}`);
    
    // Master veritabanına bağlan
    masterPool = await sql.connect(getMasterConfig());
    
    // Veritabanının var olup olmadığını kontrol et
    const result = await masterPool.request()
      .input('dbName', sql.NVarChar, dbName)
      .query(`
        SELECT database_id 
        FROM sys.databases 
        WHERE name = @dbName
      `);
    
    if (result.recordset.length === 0) {
      // Veritabanı yoksa oluştur
      console.log(`🔨 Veritabanı oluşturuluyor: ${dbName}`);
      await masterPool.request().query(`CREATE DATABASE [${dbName}]`);
      console.log(`✅ Veritabanı oluşturuldu: ${dbName}`);
    } else {
      console.log(`✅ Veritabanı zaten mevcut: ${dbName}`);
    }
    
  } catch (error) {
    console.error('❌ Veritabanı oluşturma hatası:', error.message);
    throw error;
  } finally {
    if (masterPool) {
      await masterPool.close();
    }
  }
};

const runMigrations = async () => {
  let targetPool = null;
  try {
    console.log('🚀 Migration başlatılıyor...\n');

    // Önce veritabanını oluştur veya kontrol et
    await createDatabase();
    
    console.log('\n📝 Tablolar oluşturuluyor...\n');
    
    // Hedef veritabanına bağlan
    targetPool = await sql.connect(getTargetConfig());
    console.log('✅ Veritabanına bağlandı\n');

    // Migration 1: Tests tablosunu oluştur
    console.log('📝 Migration 001: Tests tablosu oluşturuluyor...');
    await targetPool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tests' AND xtype='U')
      BEGIN
        CREATE TABLE Tests (
          test_id INT IDENTITY(1,1) PRIMARY KEY,
          test_adi NVARCHAR(255) NOT NULL,
          created_at DATETIME DEFAULT GETDATE(),
          updated_at DATETIME DEFAULT GETDATE()
        )
      END
    `);
    console.log('✅ Tests tablosu oluşturuldu\n');

    // Migration 2: Test verilerini ekle
    console.log('📝 Migration 002: Test verileri ekleniyor...');
    await targetPool.request().query(`
      IF NOT EXISTS (SELECT * FROM Tests)
      BEGIN
        INSERT INTO Tests (test_adi) VALUES 
          (N'Test 1'),
          (N'Test 2'),
          (N'Test 3'),
          (N'Test 4'),
          (N'Test 5')
      END
    `);
    console.log('✅ Test verileri eklendi\n');

    // Verileri kontrol et
    const result = await targetPool.request().query('SELECT * FROM Tests');
    console.log('📊 Eklenen test verileri:');
    console.table(result.recordset);

    console.log('\n✅ Tüm migration\'lar başarıyla tamamlandı!');
    console.log('🎉 Veritabanı kullanıma hazır!\n');
    
  } catch (error) {
    console.error('\n❌ Migration hatası:', error.message);
    console.error('Detay:', error);
    process.exit(1);
  } finally {
    if (targetPool) {
      await targetPool.close();
    }
    process.exit(0);
  }
};

runMigrations();
