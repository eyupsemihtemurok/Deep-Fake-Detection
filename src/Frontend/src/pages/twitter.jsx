import React from 'react';
import '../styles/twitter.css';

function Twitter() {
  return (
    <div className="twitter">
      {/* Header */}
      <div className="twitter__header">
        <h2>Anasayfa</h2>
      </div>

      {/* Tweet Yazma Alanı */}
      <div className="twitter__tweetBox">
        <div className="twitter__tweetBoxTop">
          <div className="twitter__avatar"></div>
          <div className="twitter__inputArea">
            <div className="twitter__inputPlaceholder">Neler oluyor?</div>
          </div>
        </div>
        <div className="twitter__tweetBoxBottom">
          <div className="twitter__icons">
            <div className="twitter__icon"></div>
            <div className="twitter__icon"></div>
            <div className="twitter__icon"></div>
            <div className="twitter__icon"></div>
            <div className="twitter__icon"></div>
          </div>
          <div className="twitter__tweetButton">Tweetle</div>
        </div>
      </div>

      {/* Tweet Listesi */}
      <div className="twitter__feed">
        {/* Boş Tweet 1 */}
        <div className="twitter__tweet">
          <div className="twitter__tweetAvatar"></div>
          <div className="twitter__tweetContent">
            <div className="twitter__tweetHeader">
              <div className="twitter__displayName"></div>
              <div className="twitter__username"></div>
              <div className="twitter__timestamp"></div>
            </div>
            <div className="twitter__tweetText"></div>
            <div className="twitter__tweetTextShort"></div>
            <div className="twitter__tweetImage"></div>
            <div className="twitter__tweetActions">
              <div className="twitter__action"></div>
              <div className="twitter__action"></div>
              <div className="twitter__action"></div>
              <div className="twitter__action"></div>
            </div>
          </div>
        </div>

        {/* Boş Tweet 2 */}
        <div className="twitter__tweet">
          <div className="twitter__tweetAvatar"></div>
          <div className="twitter__tweetContent">
            <div className="twitter__tweetHeader">
              <div className="twitter__displayName"></div>
              <div className="twitter__username"></div>
              <div className="twitter__timestamp"></div>
            </div>
            <div className="twitter__tweetText"></div>
            <div className="twitter__tweetImage"></div>
            <div className="twitter__tweetActions">
              <div className="twitter__action"></div>
              <div className="twitter__action"></div>
              <div className="twitter__action"></div>
              <div className="twitter__action"></div>
            </div>
          </div>
        </div>

        {/* Boş Tweet 3 */}
        <div className="twitter__tweet">
          <div className="twitter__tweetAvatar"></div>
          <div className="twitter__tweetContent">
            <div className="twitter__tweetHeader">
              <div className="twitter__displayName"></div>
              <div className="twitter__username"></div>
              <div className="twitter__timestamp"></div>
            </div>
            <div className="twitter__tweetText"></div>
            <div className="twitter__tweetTextShort"></div>
            <div className="twitter__tweetActions">
              <div className="twitter__action"></div>
              <div className="twitter__action"></div>
              <div className="twitter__action"></div>
              <div className="twitter__action"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Twitter;