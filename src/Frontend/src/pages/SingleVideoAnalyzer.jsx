import React, { useState } from 'react';
import '../styles/singleVideoAnalyzer.css';

const SingleVideoAnalyzer = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const [loadingRandom, setLoadingRandom] = useState(false);

  // Hızlı test için örnek URL'ler
  const sampleUrls = [
    { label: '🔴 Deepfake Örneği', url: '/videos/fake/11_21__podium_speech_happy__T7DK03O1.mp4' },
    { label: '🟢 Orjinal Örneği', url: '/videos/real/01__walking_down_indoor_hall_disgust.mp4' },
    { label: '🔴 Deepfake', url: '/videos/fake/deepfake.mp4' },
    { label: '🟢 Orjinal', url: '/videos/real/orj.mp4' }
  ];

  const handleAnalyze = async () => {
    if (!videoUrl.trim()) {
      setError('⚠️ Lütfen bir video URL\'si girin');
      return;
    }

    setAnalyzing(true);
    setError('');
    setAnalysisResult(null);

    try {
      const response = await fetch('http://localhost:3000/api/video-library/analyze-single-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ videoUrl: videoUrl.trim() })
      });

      const data = await response.json();

      if (data.success) {
        setAnalysisResult(data.result);
      } else {
        setError(data.error || 'Analiz sırasında hata oluştu');
      }
    } catch (error) {
      console.error('Analiz hatası:', error);
      setError('❌ Analiz sırasında hata oluştu: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleQuickSelect = (url) => {
    setVideoUrl(url);
    setAnalysisResult(null);
    setError('');
  };

  const handleReset = () => {
    setVideoUrl('');
    setAnalysisResult(null);
    setError('');
  };

  const handleRandomVideo = async () => {
    setLoadingRandom(true);
    setError('');
    setAnalysisResult(null);

    try {
      const response = await fetch('http://localhost:3000/api/video-library/random-video');
      const data = await response.json();

      if (data.success) {
        setVideoUrl(data.data.url);
      } else {
        setError(data.error || 'Random video seçilemedi');
      }
    } catch (error) {
      console.error('Random video hatası:', error);
      setError('❌ Random video seçilirken hata oluştu: ' + error.message);
    } finally {
      setLoadingRandom(false);
    }
  };

  const getStatusColor = () => {
    if (!analysisResult) return '#6c757d';
    
    // Güven faktörü VARSA → ORJİNAL (yeşil), YOKSA → DEEPFAKE (kırmızı)
    const hasConfidence = analysisResult.confidence_score !== null && 
                         analysisResult.confidence_score !== undefined;
    return hasConfidence ? '#2ed573' : '#ff4757';
  };

  const getStatusText = () => {
    if (!analysisResult) return 'ANALİZ BEKLİYOR';
    
    // Güven faktörü VARSA → ORJİNAL, YOKSA → DEEPFAKE
    const hasConfidence = analysisResult.confidence_score !== null && 
                         analysisResult.confidence_score !== undefined;
    return hasConfidence ? '🟢 ORJİNAL VİDEO' : '🔴 DEEPFAKE VİDEO';
  };

  const getBackgroundColor = () => {
    if (!analysisResult) return 'rgba(128, 128, 128, 0.1)';
    
    const hasConfidence = analysisResult.confidence_score !== null && 
                         analysisResult.confidence_score !== undefined;
    return hasConfidence ? 'rgba(46, 213, 115, 0.15)' : 'rgba(255, 71, 87, 0.15)';
  };

  return (
    <div className="single-video-analyzer-container">
      <div className="analyzer-header">
        <h1>🎬 Tek Video Analizi</h1>
        <p className="subtitle">Video URL'si girerek deepfake tespiti yapın</p>
      </div>

      {/* URL Input Section */}
      <div className="url-input-section">
        <div className="input-wrapper">
          <input
            type="text"
            className="video-url-input"
            placeholder="Örnek: /videos/fake/03_21__kitchen_still__V53E3RVB.mp4"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            disabled={analyzing}
          />
          <div className="input-buttons">
            <button 
              className="analyze-btn" 
              onClick={handleAnalyze}
              disabled={analyzing || !videoUrl.trim()}
            >
              {analyzing ? (
                <>
                  <span className="spinner-small"></span>
                  Analiz Ediliyor...
                </>
              ) : (
                <>
                  ⚡ Analiz Et
                </>
              )}
            </button>
            {videoUrl && (
              <button 
                className="reset-btn" 
                onClick={handleReset}
                disabled={analyzing}
              >
                🔄 Temizle
              </button>
            )}
          </div>
        </div>

        {/* Quick Select Buttons */}
        <div className="quick-select-section">
          <span className="quick-select-label">Hızlı Test:</span>
          {sampleUrls.map((sample, index) => (
            <button
              key={index}
              className="quick-select-btn"
              onClick={() => handleQuickSelect(sample.url)}
              disabled={analyzing || loadingRandom}
            >
              {sample.label}
            </button>
          ))}
          <button
            className="quick-select-btn random-btn"
            onClick={handleRandomVideo}
            disabled={analyzing || loadingRandom}
          >
            {loadingRandom ? '🔄 Yükleniyor...' : '🎲 Random Video'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      {/* Video Display and Results */}
      {videoUrl && (
        <div 
          className="video-analysis-section"
          style={{
            backgroundColor: getBackgroundColor(),
            borderColor: getStatusColor()
          }}
        >
          <div className="video-display">
            <video 
              key={videoUrl}
              controls 
              className="analyzed-video"
            >
              <source src={`http://localhost:3000${videoUrl}`} type="video/mp4" />
              Tarayıcınız video oynatmayı desteklemiyor.
            </video>
          </div>

          {/* Analysis Results */}
          <div className="analysis-results-panel">
            <h2>📊 Analiz Sonuçları</h2>
            
            {analyzing ? (
              <div className="analyzing-state">
                <div className="spinner"></div>
                <p>Video analiz ediliyor...</p>
                <p className="analyzing-hint">Bu işlem birkaç saniye sürebilir</p>
              </div>
            ) : analysisResult ? (
              <div className="results-content">
                <div 
                  className="status-badge"
                  style={{ 
                    backgroundColor: getStatusColor(),
                    boxShadow: `0 0 20px ${getStatusColor()}40`
                  }}
                >
                  {getStatusText()}
                </div>

                {analysisResult.confidence_score !== null && 
                 analysisResult.confidence_score !== undefined && (
                  <div className="confidence-display">
                    <div className="confidence-label">Güven Skoru</div>
                    <div className="confidence-value">
                      %{analysisResult.confidence_score.toFixed(2)}
                    </div>
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill"
                        style={{ 
                          width: `${analysisResult.confidence_score}%`,
                          backgroundColor: getStatusColor()
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="analysis-details">
                  <div className="detail-item">
                    <span className="detail-icon">🎬</span>
                    <span className="detail-label">Video URL:</span>
                    <span className="detail-value">{videoUrl}</span>
                  </div>
                  
                  {analysisResult.analyzed_at && (
                    <div className="detail-item">
                      <span className="detail-icon">🕐</span>
                      <span className="detail-label">Analiz Zamanı:</span>
                      <span className="detail-value">
                        {new Date(analysisResult.analyzed_at).toLocaleString('tr-TR')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="result-explanation">
                  {analysisResult.confidence_score !== null && 
                   analysisResult.confidence_score !== undefined ? (
                    <>
                      <p>✅ Bu video <strong>ORJİNAL</strong> olarak tespit edildi.</p>
                      <p>Modelimiz %{analysisResult.confidence_score.toFixed(2)} güvenle bu videonun gerçek olduğunu belirtiyor.</p>
                    </>
                  ) : (
                    <>
                      <p>⚠️ Bu video <strong>DEEPFAKE</strong> olarak tespit edildi.</p>
                      <p>Video içeriğinde yapay manipülasyon belirtileri bulundu.</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="waiting-state">
                <p>👆 Analiz başlatmak için yukarıdaki butona tıklayın</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="info-panel">
        <h3>ℹ️ Nasıl Kullanılır?</h3>
        <ol>
          <li>Yukarıdaki input alanına video URL'sini girin</li>
          <li>Veya "Hızlı Test" butonlarından birini seçin</li>
          <li>Ya da "🎲 Random Video" butonuna tıklayarak rastgele bir video seçin</li>
          <li>"Analiz Et" butonuna tıklayın</li>
          <li>Sonuçları görüntüleyin</li>
        </ol>
        <p className="info-note">
          <strong>Not:</strong> URL formatı <code>/videos/fake/dosya_adi.mp4</code> veya 
          <code>/videos/real/dosya_adi.mp4</code> şeklinde olmalıdır. Random video butonu 
          dataset klasöründen otomatik olarak bir video seçer.
        </p>
      </div>
    </div>
  );
};

export default SingleVideoAnalyzer;
