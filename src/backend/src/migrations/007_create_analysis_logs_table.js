import { getConnection } from '../config/database.js';

export const up = async () => {
  try {
    const pool = await getConnection();
    
    // AnalysisLogs tablosunu oluştur
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AnalysisLogs' AND xtype='U')
      BEGIN
        CREATE TABLE AnalysisLogs (
          log_id INT IDENTITY(1,1) PRIMARY KEY,
          content_type NVARCHAR(50) NOT NULL,
          content_id INT NOT NULL,
          analysis_type NVARCHAR(50) NOT NULL,
          result NVARCHAR(100),
          confidence_score FLOAT,
          processing_time_ms INT,
          analyzed_at DATETIME DEFAULT GETDATE()
        )
      END
    `);
    
    console.log('✅ AnalysisLogs tablosu oluşturuldu');
  } catch (error) {
    console.error('❌ Migration hatası (007_create_analysis_logs_table):', error);
    throw error;
  }
};

export const down = async () => {
  try {
    const pool = await getConnection();
    
    // AnalysisLogs tablosunu sil
    await pool.request().query(`
      IF EXISTS (SELECT * FROM sysobjects WHERE name='AnalysisLogs' AND xtype='U')
      BEGIN
        DROP TABLE AnalysisLogs
      END
    `);
    
    console.log('✅ AnalysisLogs tablosu silindi');
  } catch (error) {
    console.error('❌ Rollback hatası (007_create_analysis_logs_table):', error);
    throw error;
  }
};
