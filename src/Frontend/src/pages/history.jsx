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
];

const History = () => {
  return (
    <div className="history-container">
      <header>
        <h1>Geçmiş Analizler</h1>
        <p className="subtitle">Daha önce analiz ettiğiniz videoların kayıtları</p>
      </header>

      <div className="history-list">
        {sampleData.length === 0 ? (
          <div className="no-history">
            <p>Henüz geçmiş analiziniz yok.</p>
          </div>
        ) : (
          sampleData.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-video">
                <video controls width="100%" src={item.videoUrl}>
                  Tarayıcınız video etiketini desteklemiyor.
                </video>
              </div>
              <div className="history-info">
                <p><strong>Tarih:</strong> {item.date}</p>
                <p>
                  <strong>Durum:</strong>{" "}
                  <span className={item.isDeepfake ? "deepfake" : "original"}>
                    {item.isDeepfake ? "DEEPFAKE" : "ORJİNAL"}
                  </span>
                </p>
                <p><strong>Güven Seviyesi:</strong> %{item.confidence}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
