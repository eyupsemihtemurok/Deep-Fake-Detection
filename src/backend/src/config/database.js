import sql from 'mssql/msnodesqlv8.js';
import dotenv from 'dotenv';

dotenv.config();

// Windows Authentication için connection string
const config = {
  connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=localhost;Database=${process.env.DB_DATABASE || 'HackathonDB'};Trusted_Connection=yes;`
};

let pool = null;

export const getConnection = async () => {
  try {
    if (pool) {
      return pool;
    }
    
    pool = await sql.connect(config);
    console.log('✅ MS SQL veritabanına bağlandı');
    return pool;
  } catch (error) {
    console.error('❌ Veritabanı bağlantı hatası:', error);
    throw error;
  }
};

export const closeConnection = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('🔌 Veritabanı bağlantısı kapatıldı');
    }
  } catch (error) {
    console.error('❌ Bağlantı kapatma hatası:', error);
    throw error;
  }
};

export { sql };
