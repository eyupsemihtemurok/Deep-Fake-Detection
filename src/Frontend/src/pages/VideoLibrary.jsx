import React, { useState, useEffect } from 'react';
import '../styles/videoLibrary.css';

const VideoLibrary = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [aiModelActive, setAiModelActive] = useState(false); // AI model durumu
  
  // Sayfalama state'leri
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);
  const videosPerPage = 6;

  useEffect(() => {
    loadVideos(currentPage);
  }, [currentPage]);

  const loadVideos = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/video-library?page=${page}&limit=${videosPerPage}`);
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.data);
        setTotalPages(data.totalPages);
        setTotalVideos(data.total);
        setCurrentPage(data.currentPage);
      }
    } catch (error) {
      console.error('Videolar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLocalVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/video-library/load-local', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        alert(`✅ ${data.message}`);
        setCurrentPage(1); // İlk sayfaya dön
        setAnalysisResults(null); // Önceki analiz sonuçlarını temizle
        await loadVideos(1);
        
        // Eğer AI model aktifse, videoları otomatik analiz et
        if (aiModelActive) {
          await analyzeAllVideos();
        }
      }
    } catch (error) {
      console.error('Local videolar yüklenirken hata:', error);
      alert('❌ Videolar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const toggleAiModel = () => {
    setAiModelActive(!aiModelActive);
    if (!aiModelActive) {
      alert('✅ AI Model Aktif Edildi - Yeni yüklenen videolar otomatik analiz edilecek');
    } else {
      alert('⏸️ AI Model Pasif Edildi - Videolar analiz edilmeyecek');
    }
  };

  const analyzeAllVideos = async () => {
    if (!aiModelActive) {
      alert('⚠️ AI model pasif! Önce AI modeli aktif edin.');
      return;
    }
    
    setAnalyzing(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/video-library/analyze-all', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setAnalysisResults(data.results);
        
        // Mevcut sayfayı yeniden yükle
        await loadVideos(currentPage);
        alert('✅ Analiz tamamlandı!');
      }
    } catch (error) {
      console.error('Analiz sırasında hata:', error);
      alert('❌ Analiz sırasında hata oluştu');
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getVideoBackgroundColor = (video) => {
    // Analiz edilmemişse gri arka plan
    if (video.is_deepfake === null) return 'rgba(128, 128, 128, 0.15)';
    
    // Güven faktörü VARSA → ORJİNAL (yeşil), YOKSA → DEEPFAKE (kırmızı)
    const hasConfidence = video.confidence_score !== null && video.confidence_score !== undefined;
    return hasConfidence ? 'rgba(46, 213, 115, 0.2)' : 'rgba(255, 71, 87, 0.2)';
  };

  const getVideoBorderColor = (video) => {
    // Analiz edilmemişse gri çerçeve
    if (video.is_deepfake === null) return 'rgba(128, 128, 128, 0.3)';
    
    // Güven faktörü VARSA → ORJİNAL (yeşil), YOKSA → DEEPFAKE (kırmızı)
    const hasConfidence = video.confidence_score !== null && video.confidence_score !== undefined;
    return hasConfidence ? '#2ed573' : '#ff4757';
  };

  return (
    <div className="video-library-container">
      {/* AI Analiz ve Action Buttons - Tek Satır */}
      <div className="controls-row">
        <div className="ai-controls">
          <button 
            className={`ai-dropdown-btn ${aiModelActive ? 'active' : 'inactive'}`}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="ai-icon">⚡</span>
            <span className="ai-text">AI Analiz</span>
            <span className={`status-dot ${aiModelActive ? 'active' : 'inactive'}`}></span>
          </button>
          
          {showDropdown && (
            <div className="ai-dropdown-content">
              <div className="dropdown-header">
                <h3>AI Deepfake Tespiti</h3>
                <button className="close-dropdown" onClick={() => setShowDropdown(false)}>✕</button>
              </div>
              
              {/* Model Durumu - Tıklanabilir */}
              <div className="model-status-section">
                <div className="section-title">Model Durumu:</div>
                <button 
                  className={`model-status-toggle ${aiModelActive ? 'active' : 'inactive'}`}
                  onClick={toggleAiModel}
                >
                  {aiModelActive ? '🟢 AKTİF' : '🔴 PASİF'}
                </button>
              </div>

              {/* Analiz Sonuçları */}
              <div className="analysis-results-section">
                <div className="section-title">Analiz Sonuçları:</div>
                {analysisResults && analysisResults.length > 0 ? (
                  <div className="results-list">
                    {analysisResults.map((result, index) => {
                      // Güven faktörü VARSA → ORJİNAL, YOKSA → DEEPFAKE
                      const hasConfidence = result.confidence_score !== null && result.confidence_score !== undefined;
                      const isOriginal = hasConfidence;
                      
                      return (
                        <div 
                          key={result.video_id} 
                          className={`result-item ${isOriginal ? 'real' : 'fake'}`}
                        >
                          <span className="video-label">Video {index + 1}:</span>
                          <span className="result-status">
                            {isOriginal ? '🟢 Orjinal' : '🔴 Deepfake'}
                          </span>
                          {hasConfidence && (
                            <span className="confidence-value">
                              (%{result.confidence_score.toFixed(1)})
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="no-results">
                    <p>Henüz analiz yapılmadı</p>
                    {aiModelActive && videos.length > 0 && (
                      <button 
                        className="analyze-trigger-btn"
                        onClick={analyzeAllVideos}
                        disabled={analyzing}
                      >
                        {analyzing ? '🔄 Analiz Ediliyor...' : '🚀 Analiz Et'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={loadLocalVideos} disabled={loading} className="load-btn">
            {loading ? '⏳ Yükleniyor...' : '📂 Local Videoları Yükle'}
          </button>
          <button 
            onClick={() => loadVideos(currentPage)} 
            disabled={loading} 
            className="refresh-btn"
            title="Yenile"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Pagination Info */}
      {totalVideos > 0 && (
        <div className="pagination-info">
          <p>
            Toplam <strong>{totalVideos}</strong> video bulundu
          </p>
          <p>
            Sayfa <strong>{currentPage}</strong> / <strong>{totalPages}</strong>
          </p>
        </div>
      )}

      {/* Video Grid */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Videolar yükleniyor...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="no-videos">
          <p>📭 Henüz video yüklenmedi</p>
          <p className="hint">Yukarıdaki "Local Videoları Yükle" butonuna tıklayın</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((video, index) => (
            <div 
              key={video.test_video_id} 
              className="video-card"
              style={{
                backgroundColor: getVideoBackgroundColor(video),
                borderColor: getVideoBorderColor(video)
              }}
            >
              <div className="video-number-badge">Video {index + 1}</div>
              
              <div className="video-player">
                <video 
                  controls 
                  className="video-element"
                  poster={video.thumbnail_url || undefined}
                >
                  <source src={`http://localhost:3000${video.video_url}`} type="video/mp4" />
                  Tarayıcınız video oynatmayı desteklemiyor.
                </video>
              </div>

              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                
                {video.is_deepfake !== null ? (
                  <div className="analysis-badge">
                    {/* Güven faktörü VARSA → ORJİNAL, YOKSA → DEEPFAKE */}
                    {video.confidence_score !== null && video.confidence_score !== undefined ? (
                      <>
                        <div className="status-indicator real">
                          🟢 ORJİNAL
                        </div>
                        <div className="confidence-score">
                          Güven: %{video.confidence_score.toFixed(2)}
                        </div>
                      </>
                    ) : (
                      <div className="status-indicator fake">
                        🔴 DEEPFAKE
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="analysis-badge">
                    <div className="status-indicator pending">
                      ⚪ ANALİZ BEKLİYOR
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && !loading && (
        <div className="pagination-controls">
          <button 
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ⏮️ İlk
          </button>
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ◀️ Önceki
          </button>
          
          <div className="page-numbers">
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              // Sadece yakın sayfaları göster
              if (
                pageNum === 1 || 
                pageNum === totalPages || 
                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                return <span key={pageNum} className="page-ellipsis">...</span>;
              }
              return null;
            })}
          </div>

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Sonraki ▶️
          </button>
          <button 
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Son ⏭️
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoLibrary;
