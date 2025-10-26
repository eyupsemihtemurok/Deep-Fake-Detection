import React from "react";
import "../styles/history.css";

const sampleData = [
  {
    id: 1,
    videoUrl: "https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    date: "2025-10-25 15:30",
    isDeepfake: false,
    confidence: 95.23,
  },
  {
    id: 2,
    videoUrl: "https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    date: "2025-10-24 12:15",
    isDeepfake: true,
    confidence: 88.67,
  },
  {
    id: 3,
    videoUrl: "https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    date: "2025-10-23 09:45",
    isDeepfake: false,
    confidence: 98.10,
  },
];

const History = () => {
  return (
    <div className="history-page">
      <header className="history-header">
        <h1>Geçmiş Analizler</h1>
        <p className="subtitle">Daha önce analiz ettiğiniz videoların kayıtları</p>
      </header>

      <div className="history-grid">
        {sampleData.length === 0 ? (
          <div className="no-history">
            <p>Henüz geçmiş analiziniz yok.</p>
          </div>
        ) : (
          sampleData.map((item) => (
            <div key={item.id} className="history-column">
              <div className="history-video">
                <video controls preload="metadata" src={`${item.videoUrl}#t=0.5`}>
                   Tarayıcınız video etiketini desteklemiyor.
                </video>
              </div>
              <div className="history-info">
                <p className="info-date">
                  <strong>Tarih:</strong>
                  <span>{item.date}</span>
                </p>
                <div className="info-status">
                  <strong>Durum:</strong>
                  <span className={item.isDeepfake ? "status-deepfake" : "status-original"}>
                    {item.isDeepfake ? "DEEPFAKE" : "ORJİNAL"}
                  </span>
                </div>
                <p className="info-confidence">
                  <strong>Güven Seviyesi:</strong>
                  <span>%{item.confidence.toFixed(2)}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;