import React, { useState } from 'react';
import '../styles/twitter.css';

function Twitter() {
  const [videoUrl, setVideoUrl] = useState('');

  const handleAnalyze = () => {
    // Analiz işlemi burada yapılacak
    console.log('Video analiz ediliyor:', videoUrl);
  };

  return (
    <div className="twitter">
      {/* Header */}
      <div className="twitter__header">
        <h2>Video Deepfake Analizi</h2>
        <p className="twitter__headerDesc">Twitter videolarını analiz edin</p>
      </div>

      {/* Video URL Girişi */}
      <div className="twitter__tweetBox">
        <div className="twitter__tweetBoxTop">
          <div className="twitter__avatar">
            <i className="fas fa-video"></i>
          </div>
          <div className="twitter__inputArea">
            <input
              type="text"
              placeholder="Twitter video URL'sini yapıştırın"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="twitter__input"
            />
          </div>
        </div>
        <div className="twitter__tweetBoxBottom">
          <div className="twitter__icons">
            <div className="twitter__icon twitter__icon--video" title="Video URL">
              <i className="fas fa-link"></i>
            </div>
            <div className="twitter__icon twitter__icon--info" title="Bilgi">
              <i className="fas fa-info-circle"></i>
            </div>
          </div>
          <button 
            className="twitter__tweetButton"
            onClick={handleAnalyze}
            disabled={!videoUrl}
          >
            Analiz Et
          </button>
        </div>
      </div>

      {/* Analiz Sonuçları */}
      <div className="twitter__feed">
        {/* Örnek 1 - Deepfake Yüksek Güven */}
        <div className="twitter__tweet">
          <div className="twitter__tweetAvatar">
            <i className="fas fa-user-shield"></i>
          </div>
          <div className="twitter__tweetContent">
            <div className="twitter__tweetHeader">
              <span className="twitter__time">2 dk önce</span>
            </div>
            <div className="twitter__analysisResult deepfake">
              <div className="twitter__resultBadge">
                <i className="fas fa-exclamation-triangle"></i>
                DEEPFAKE TESPİT EDİLDİ
              </div>
              <div className="twitter__confidenceBar">
                <div className="twitter__confidenceLevel" style={{width: '95%'}}>
                  %95 Deepfake
                </div>
              </div>
            </div>
            <div className="twitter__videoContainer">
              <video controls>
                <source src="https://example.com/video1.mp4" type="video/mp4" />
                Tarayıcınız video elementini desteklemiyor.
              </video>
              <div className="twitter__videoOverlay deepfake">
                <i className="fas fa-exclamation-circle"></i>
              </div>
            </div>
            <div className="twitter__analysisDetails">
              <div className="twitter__detail">
                <i className="fas fa-clock"></i>
                Analiz Süresi: 2.8s
              </div>
              <div className="twitter__detail">
                <i className="fas fa-chart-bar"></i>
                Güven Oranı: %95
              </div>
              <div className="twitter__detail">
                <i className="fas fa-file-video"></i>
                Video Süresi: 0:45
              </div>
            </div>
          </div>
        </div>

        {/* Örnek 2 - Orijinal Video */}
        <div className="twitter__tweet">
          <div className="twitter__tweetAvatar">
            <i className="fas fa-user-shield"></i>
          </div>
          <div className="twitter__tweetContent">
            <div className="twitter__tweetHeader">
              <span className="twitter__time">5 dk önce</span>
            </div>
            <div className="twitter__analysisResult original">
              <div className="twitter__resultBadge">
                <i className="fas fa-check-circle"></i>
                ORİJİNAL VİDEO
              </div>
              <div className="twitter__confidenceBar">
                <div className="twitter__confidenceLevel" style={{width: '98%'}}>
                  %98 Orijinal
                </div>
              </div>
            </div>
            <div className="twitter__videoContainer">
              <video controls>
                <source src="https://example.com/video2.mp4" type="video/mp4" />
                Tarayıcınız video elementini desteklemiyor.
              </video>
              <div className="twitter__videoOverlay original">
                <i className="fas fa-check"></i>
              </div>
            </div>
            <div className="twitter__analysisDetails">
              <div className="twitter__detail">
                <i className="fas fa-clock"></i>
                Analiz Süresi: 2.1s
              </div>
              <div className="twitter__detail">
                <i className="fas fa-chart-bar"></i>
                Güven Oranı: %98
              </div>
              <div className="twitter__detail">
                <i className="fas fa-file-video"></i>
                Video Süresi: 1:20
              </div>
            </div>
          </div>
        </div>

        {/* Örnek 3 - Deepfake Orta Güven */}
        <div className="twitter__tweet">
          <div className="twitter__tweetAvatar">
            <i className="fas fa-user-shield"></i>
          </div>
          <div className="twitter__tweetContent">
            <div className="twitter__tweetHeader">
              <span className="twitter__time">15 dk önce</span>
            </div>
            <div className="twitter__analysisResult deepfake">
              <div className="twitter__resultBadge">
                <i className="fas fa-exclamation-triangle"></i>
                DEEPFAKE TESPİT EDİLDİ
              </div>
              <div className="twitter__confidenceBar">
                <div className="twitter__confidenceLevel" style={{width: '75%'}}>
                  %75 Deepfake
                </div>
              </div>
            </div>
            <div className="twitter__videoContainer">
              <video controls>
                <source src="https://example.com/video3.mp4" type="video/mp4" />
                Tarayıcınız video elementini desteklemiyor.
              </video>
              <div className="twitter__videoOverlay deepfake">
                <i className="fas fa-exclamation-circle"></i>
              </div>
            </div>
            <div className="twitter__analysisDetails">
              <div className="twitter__detail">
                <i className="fas fa-clock"></i>
                Analiz Süresi: 3.5s
              </div>
              <div className="twitter__detail">
                <i className="fas fa-chart-bar"></i>
                Güven Oranı: %75
              </div>
              <div className="twitter__detail">
                <i className="fas fa-file-video"></i>
                Video Süresi: 2:15
              </div>
            </div>
          </div>
        </div>

        {/* Örnek 4 - Orijinal Video */}
        <div className="twitter__tweet">
          <div className="twitter__tweetAvatar">
            <i className="fas fa-user-shield"></i>
          </div>
          <div className="twitter__tweetContent">
            <div className="twitter__tweetHeader">
              <span className="twitter__time">30 dk önce</span>
            </div>
            <div className="twitter__analysisResult original">
              <div className="twitter__resultBadge">
                <i className="fas fa-check-circle"></i>
                ORİJİNAL VİDEO
              </div>
              <div className="twitter__confidenceBar">
                <div className="twitter__confidenceLevel" style={{width: '92%'}}>
                  %92 Orijinal
                </div>
              </div>
            </div>
            <div className="twitter__videoContainer">
              <video controls>
                <source src="https://example.com/video4.mp4" type="video/mp4" />
                Tarayıcınız video elementini desteklemiyor.
              </video>
              <div className="twitter__videoOverlay original">
                <i className="fas fa-check"></i>
              </div>
            </div>
            <div className="twitter__analysisDetails">
              <div className="twitter__detail">
                <i className="fas fa-clock"></i>
                Analiz Süresi: 2.4s
              </div>
              <div className="twitter__detail">
                <i className="fas fa-chart-bar"></i>
                Güven Oranı: %92
              </div>
              <div className="twitter__detail">
                <i className="fas fa-file-video"></i>
                Video Süresi: 1:05
              </div>
            </div>
          </div>
        </div>

        {/* Örnek 5 - Deepfake Düşük Güven */}
        <div className="twitter__tweet">
          <div className="twitter__tweetAvatar">
            <i className="fas fa-user-shield"></i>
          </div>
          <div className="twitter__tweetContent">
            <div className="twitter__tweetHeader">
              <span className="twitter__time">1 saat önce</span>
            </div>
            <div className="twitter__analysisResult deepfake">
              <div className="twitter__resultBadge">
                <i className="fas fa-exclamation-triangle"></i>
                DEEPFAKE TESPİT EDİLDİ
              </div>
              <div className="twitter__confidenceBar">
                <div className="twitter__confidenceLevel" style={{width: '65%'}}>
                  %65 Deepfake
                </div>
              </div>
            </div>
            <div className="twitter__videoContainer">
              <video controls>
                <source src="https://example.com/video5.mp4" type="video/mp4" />
                Tarayıcınız video elementini desteklemiyor.
              </video>
              <div className="twitter__videoOverlay deepfake">
                <i className="fas fa-exclamation-circle"></i>
              </div>
            </div>
            <div className="twitter__analysisDetails">
              <div className="twitter__detail">
                <i className="fas fa-clock"></i>
                Analiz Süresi: 4.2s
              </div>
              <div className="twitter__detail">
                <i className="fas fa-chart-bar"></i>
                Güven Oranı: %65
              </div>
              <div className="twitter__detail">
                <i className="fas fa-file-video"></i>
                Video Süresi: 3:00
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Twitter;