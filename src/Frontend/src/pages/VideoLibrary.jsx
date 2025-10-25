import React, { useState, useEffect } from 'react';
import '../styles/videoLibrary.css';

const VideoLibrary = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  
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
        loadVideos(1);
      }
    } catch (error) {
      console.error('Local videolar yüklenirken hata:', error);
      alert('❌ Videolar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const analyzeAllVideos = async () => {
    setAnalyzing(true);
    setShowDropdown(false);
    
    try {
      const response = await fetch('http://localhost:3000/api/video-library/analyze-all', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setAnalysisResults(data.results);
        setShowDropdown(true);
        
        // Mevcut sayfayı yeniden yükle
        loadVideos(currentPage);
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
    if (video.is_deepfake === null) return 'transparent';
    return video.is_deepfake ? 'rgba(255, 71, 87, 0.2)' : 'rgba(46, 213, 115, 0.2)';
  };

  const getVideoBorderColor = (video) => {
    if (video.is_deepfake === null) return 'rgba(255, 255, 255, 0.1)';
    return video.is_deepfake ? '#ff4757' : '#2ed573';
  };

  return (
    <div className="video-library-container">
      <header>
        <h1>📹 Video Kütüphanesi</h1>
        <p className="subtitle">Deepfake tespit sistemi ile videoları analiz edin</p>
      </header>

      {/* AI Dropdown */}
      <div className="ai-controls">
        <button 
          className="ai-dropdown-btn"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          🤖 AI Analiz ▼
        </button>
        
        {showDropdown && (
          <div className="ai-dropdown-content">
            <div className="dropdown-header">
              <h3>AI Deepfake Tespiti</h3>
              <button className="close-dropdown" onClick={() => setShowDropdown(false)}>✕</button>
            </div>
            
            <button 
              className="analyze-btn"
              onClick={analyzeAllVideos}
              disabled={analyzing || videos.length === 0}
            >
              {analyzing ? '🔄 Analiz Ediliyor...' : '🚀 Modeli Aktif Et'}
            </button>

            {analysisResults && (
              <div className="analysis-results">
                <h4>📊 Analiz Sonuçları:</h4>
                <div className="results-list">
                  {analysisResults.map((result, index) => (
                    <div 
                      key={result.video_id} 
                      className={`result-item ${result.is_deepfake ? 'fake' : 'real'}`}
                    >
                      <span className="video-number">Video {index + 1}</span>
                      <span className="result-label">
                        {result.is_deepfake ? '🔴 DEEPFAKE' : '🟢 GERÇEK'}
                      </span>
                      <span className="confidence">
                        %{result.confidence_score?.toFixed(2) || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button onClick={loadLocalVideos} disabled={loading} className="load-btn">
          {loading ? '⏳ Yükleniyor...' : '📂 Local Videoları Yükle'}
        </button>
        <button onClick={() => loadVideos(currentPage)} disabled={loading} className="refresh-btn">
          🔄 Yenile
        </button>
      </div>

      {/* Pagination Info */}
      {totalVideos > 0 && (
        <div className="pagination-info">
          <p>
            Toplam <strong>{totalVideos}</strong> video bulundu 
            ({videos.filter(v => !v.is_deepfake).length} gerçek, {videos.filter(v => v.is_deepfake).length} deepfake)
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
              
              <div className="video-thumbnail">
                <div className="placeholder-thumbnail">
                  🎬
                </div>
              </div>

              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                
                {video.is_deepfake !== null && (
                  <div className="analysis-badge">
                    <div className={`status-indicator ${video.is_deepfake ? 'fake' : 'real'}`}>
                      {video.is_deepfake ? '🔴 DEEPFAKE' : '🟢 ORJİNAL'}
                    </div>
                    {video.confidence_score && (
                      <div className="confidence-score">
                        Güven: %{video.confidence_score.toFixed(2)}
                      </div>
                    )}
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
