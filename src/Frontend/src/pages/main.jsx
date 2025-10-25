import { useState } from 'react';
import '../styles/main.css';

const Main = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleAnalyze = () => {
    if (!videoUrl) return;
    
    setIsLoading(true);
    setVideoLoaded(false);
    setResults(null);
    
    // Simüle edilmiş AI analizi (gerçek uygulamada API çağrısı yapılacak)
    setTimeout(() => {
      setIsLoading(false);
      setVideoLoaded(true);
      
      // Rastgele sonuçlar üret (gerçek uygulamada AI'dan gelecek)
      const isDeepfake = Math.random() > 0.5;
      const confidence = Math.random() * 30 + 70; // %70-100 arası güven
      
      setResults({
        isDeepfake,
        confidence: confidence.toFixed(2),
        analysisDetails: {
          facialConsistency: (Math.random() * 40 + 60).toFixed(2),
          eyeBlinking: (Math.random() * 40 + 60).toFixed(2),
          lipSync: (Math.random() * 40 + 60).toFixed(2),
          lighting: (Math.random() * 40 + 60).toFixed(2),
          audioAnalysis: (Math.random() * 40 + 60).toFixed(2)
        }
      });
    }, 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const getOriginalVideo = () => {
    alert("Orjinal video kaynağı bulunuyor... (Bu özellik gerçek uygulamada geliştirilecek)");
  };

  const resetAnalysis = () => {
    setVideoUrl('');
    setResults(null);
    setVideoLoaded(false);
  };

  return (
    <div className="main-container">
      <header>
        <h1>Deepfake Kontrol Aracı</h1>
        <p className="subtitle">Video linkini girerek deepfake olup olmadığını kontrol edin</p>
      </header>
      
      <div className="input-section">
        <input
          type="text"
          className="url-input"
          placeholder="Video URL'sini buraya yapıştırın..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <div className="button-group">
          <button className="analyze-btn" onClick={handleAnalyze} disabled={isLoading}>
            {isLoading ? 'Analiz Ediliyor...' : 'Analiz Et'}
          </button>
          <button className="reset-btn" onClick={resetAnalysis}>
            Temizle
          </button>
        </div>
      </div>
      
      <div className="content">
        <div className="video-section">
          <div className="video-container">
            {isLoading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Video analiz ediliyor, lütfen bekleyin...</p>
                <p className="loading-subtitle">AI modelimiz videoyu inceliyor</p>
              </div>
            ) : videoLoaded ? (
              <div className="video-wrapper">
                <video 
                  controls 
                  width="100%" 
                  src={videoUrl.includes('youtube') || videoUrl.includes('youtu.be') 
                    ? 'https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' 
                    : videoUrl}
                >
                  Tarayıcınız video etiketini desteklemiyor.
                </video>
                <div className="video-info">
                  <p>Video başarıyla yüklendi ve analize hazır</p>
                </div>
              </div>
            ) : (
              <div className="video-placeholder">
                <div className="placeholder-icon">🎬</div>
                <p>Video burada görünecek</p>
                <p className="placeholder-subtitle">Yukarıdaki alana video URL'sini girin</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="results-section">
          <h2 className="results-title">
            {results ? 'Analiz Sonuçları' : 'Sonuçlar'}
            {results && (
              <span className={`status-badge ${results.isDeepfake ? 'deepfake' : 'original'}`}>
                {results.isDeepfake ? 'DEEPFAKE' : 'ORJİNAL'}
              </span>
            )}
          </h2>
          
          {results ? (
            <div className="results-content">
              <div className="result-item">
                <div className="result-label">Deepfake Durumu:</div>
                <div className="result-value" style={{color: results.isDeepfake ? '#ff4757' : '#2ed573'}}>
                  {results.isDeepfake ? 'DEEPFAKE TESPİT EDİLDİ' : 'ORJİNAL VİDEO'}
                </div>
              </div>
              
              <div className="result-item">
                <div className="result-label">Güven Seviyesi:</div>
                <div className="result-value">%{results.confidence}</div>
                <div className="confidence-bar">
                  <div 
                    className="confidence-level" 
                    style={{width: `${results.confidence}%`}}
                  ></div>
                </div>
              </div>
              
              <div className="result-item">
                <div className="result-label">Detaylı Analiz:</div>
                <div className="analysis-details">
                  <div className="analysis-item">
                    <span>Yüz Tutarlılığı:</span>
                    <span>%{results.analysisDetails.facialConsistency}</span>
                  </div>
                  <div className="analysis-item">
                    <span>Göz Kırpma:</span>
                    <span>%{results.analysisDetails.eyeBlinking}</span>
                  </div>
                  <div className="analysis-item">
                    <span>Dudak Senkronizasyonu:</span>
                    <span>%{results.analysisDetails.lipSync}</span>
                  </div>
                  <div className="analysis-item">
                    <span>Işıklandırma:</span>
                    <span>%{results.analysisDetails.lighting}</span>
                  </div>
                  <div className="analysis-item">
                    <span>Ses Analizi:</span>
                    <span>%{results.analysisDetails.audioAnalysis}</span>
                  </div>
                </div>
              </div>
              
              <div className="original-video">
                <button className="original-btn" onClick={getOriginalVideo}>
                  <span className="btn-icon">🔍</span>
                  Orjinal Videoyu Bul
                </button>
              </div>
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">📊</div>
              <p>
                {isLoading 
                  ? 'Analiz devam ediyor...' 
                  : 'Analiz sonuçları burada görünecek'}
              </p>
              {!isLoading && (
                <p className="no-results-subtitle">
                  Video URL'sini girip "Analiz Et" butonuna tıklayın
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;