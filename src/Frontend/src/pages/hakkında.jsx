import React from 'react';
import { FaShieldAlt, FaBullseye, FaUsers, FaLaptopCode, FaHandshake, FaLightbulb, FaRocket, FaHeart, FaGlobe } from 'react-icons/fa';
import '../styles/hakkında.css';

const Hakkinda = () => {
  return (
    <div className="about-us-main">
      <div className="about-us-container">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content">
            <div className="hero-badge">
              <FaShieldAlt className="badge-icon" />
              <span>Güvenli Dijital Gelecek</span>
            </div>
            <h1 className="hero-title">
              Dijital Dünyanın
              <span className="gradient-text"> Güvenilir Gözü</span>
            </h1>
            <p className="hero-description">
              Gelişmiş yapay zeka ile gerçeği kurgudan ayırıyor, dijital içeriklerin 
              bütünlüğünü koruyoruz. Deepfake tehditlerine karşı en güçlü kalkan.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">%99.8</div>
                <div className="stat-label">Doğruluk Oranı</div>
              </div>
              <div className="stat">
                <div className="stat-number">50ms</div>
                <div className="stat-label">Tepki Süresi</div>
              </div>
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Analiz Edilen İçerik</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <FaShieldAlt className="card-icon" />
              <span>Güvenlik</span>
            </div>
            <div className="floating-card card-2">
              <FaLaptopCode className="card-icon" />
              <span>Teknoloji</span>
            </div>
            <div className="floating-card card-3">
              <FaBullseye className="card-icon" />
              <span>Hassasiyet</span>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mission-vision-section">
          <div className="section-header">
            <h2 className="section-title">Hedeflerimiz</h2>
            <p className="section-subtitle">Geleceği şekillendiren vizyonumuz</p>
          </div>
          <div className="mission-cards">
            <div className="mission-card">
              <div className="card-icon-wrapper">
                <FaBullseye className="mission-icon" />
              </div>
              <h3>Misyonumuz</h3>
              <p>
                En gelişmiş derin öğrenme modellerini kullanarak, bireyleri ve kurumları 
                deepfake teknolojisinin yarattığı bilgi kirliliği, sahtekarlık ve itibar 
                suikastı gibi tehditlere karşı korumak ve dijital güveni yeniden tesis etmektir.
              </p>
              <div className="card-decoration"></div>
            </div>
            <div className="mission-card">
              <div className="card-icon-wrapper">
                <FaLightbulb className="mission-icon" />
              </div>
              <h3>Vizyonumuz</h3>
              <p>
                Herkesin dijital içeriklerin gerçekliğinden emin olabildiği, güvenli ve 
                şeffaf bir dijital ekosistem yaratmada dünya lideri olmaktır. Teknolojimizle 
                dezenformasyonun bir adım önünde olmayı hedefliyoruz.
              </p>
              <div className="card-decoration"></div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="story-section">
          <div className="story-content">
            <div className="story-text">
              <div className="section-header">
                <h2 className="section-title">Biz Kimiz?</h2>
                <p className="section-subtitle">Geleceğin teknolojisini bugünden inşa ediyoruz</p>
              </div>
              <p className="story-description">
                Bizler, yapay zeka, siber güvenlik ve veri bilimi alanlarında uzmanlaşmış 
                bir grup mühendis ve araştırmacıyız. Deepfake teknolojisinin sunduğu yaratıcı 
                potansiyelin farkındayız, ancak kötüye kullanımının yarattığı ciddi riskleri 
                de görüyoruz.
              </p>
              <p className="story-description">
                Bu nedenle, dijital medyanın güvenilirliğini sağlamak ve gerçeği korumak 
                amacıyla bir araya geldik. Yılların getirdiği tecrübeyi, en son teknolojilerle 
                birleştirerek bu zorlu mücadelede ön saflarda yer alıyoruz.
              </p>
              <div className="expertise-tags">
                <span className="expertise-tag">Yapay Zeka</span>
                <span className="expertise-tag">Siber Güvenlik</span>
                <span className="expertise-tag">Veri Bilimi</span>
                <span className="expertise-tag">Deep Learning</span>
              </div>
            </div>
            <div className="story-visual">
              <div className="team-illustration">
                <div className="team-member member-1">
                  <div className="member-avatar"></div>
                </div>
                <div className="team-member member-2">
                  <div className="member-avatar"></div>
                </div>
                <div className="team-member member-3">
                  <div className="member-avatar"></div>
                </div>
                <div className="connecting-line"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className="technology-section">
          <div className="section-header">
            <h2 className="section-title">Teknolojimiz</h2>
            <p className="section-subtitle">En gelişmiş AI teknolojileri ile donatıldık</p>
          </div>
          <div className="tech-features">
            <div className="tech-feature">
              <div className="feature-icon-wrapper">
                <FaLaptopCode className="feature-icon" />
              </div>
              <h3>Çok Katmanlı Analiz</h3>
              <p>
                Görüntü ve ses verilerini eş zamanlı analiz ederek manipülasyonun en ince 
                izlerini bile tespit ederiz. Piksel tutarsızlıkları, doğal olmayan yüz 
                hareketleri ve sentetik ses kalıpları radarımızdan kaçmaz.
              </p>
              <div className="feature-highlight">%99.9 Doğruluk</div>
            </div>
            <div className="tech-feature">
              <div className="feature-icon-wrapper">
                <FaRocket className="feature-icon" />
              </div>
              <h3>Gerçek Zamanlı Tespit</h3>
              <p>
                Canlı yayınlar ve video görüşmeleri gibi anlık veri akışlarında bile 
                saniyeler içinde analiz yaparak anında geri bildirim sağlarız. Bu sayede 
                tehditler ortaya çıktığı anda engellenir.
              </p>
              <div className="feature-highlight">50ms Tepki Süresi</div>
            </div>
            <div className="tech-feature">
              <div className="feature-icon-wrapper">
                <FaGlobe className="feature-icon" />
              </div>
              <h3>Sürekli Gelişen Yapay Zeka</h3>
              <p>
                Derin öğrenme modellerimiz, yeni deepfake üretim tekniklerini sürekli 
                öğrenerek kendini günceller. Bu adaptif yapı, teknolojimizin her zaman 
                en güncel tehditlere karşı bile etkili olmasını sağlar.
              </p>
              <div className="feature-highlight">7/24 Güncel</div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="values-section">
          <div className="section-header">
            <h2 className="section-title">Değerlerimiz</h2>
            <p className="section-subtitle">İşimizin kalbinde yatan prensipler</p>
          </div>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon-wrapper">
                <FaShieldAlt className="value-icon" />
              </div>
              <h4>Güvenilirlik</h4>
              <p>Yaptığımız her işte dürüstlük ve şeffaflığı ön planda tutarız. Müşterilerimizin güveni bizim için her şeyden önemlidir.</p>
            </div>
            <div className="value-item">
              <div className="value-icon-wrapper">
                <FaLightbulb className="value-icon" />
              </div>
              <h4>İnovasyon</h4>
              <p>Sürekli araştırma ve geliştirme ile teknolojinin sınırlarını zorlarız. Yenilikçi çözümler üretmek DNA'mızda var.</p>
            </div>
            <div className="value-item">
              <div className="value-icon-wrapper">
                <FaHeart className="value-icon" />
              </div>
              <h4>Sorumluluk</h4>
              <p>Teknolojimizin topluma olumlu katkı sağlaması için etik kurallar çerçevesinde hareket ederiz.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Dijital Güvenlikte Yeni Çağ</h2>
            <p>Deepfake tehditlerine karşı koruma kalkanınızı hemen oluşturun</p>
            <button className="cta-button">
              <FaShieldAlt className="button-icon" />
              Ücretsiz Deneyin
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Hakkinda;