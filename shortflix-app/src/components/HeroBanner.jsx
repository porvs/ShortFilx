import React from 'react';
import { Link } from 'react-router-dom';
import './HeroBanner.css';

function HeroBanner({ video }) {
  // video 데이터가 없으면 아무것도 표시하지 않음
  if (!video) {
    return null;
  }

  const videoId = video.id.videoId;
  const title = video.snippet.title;
  const description = video.snippet.description;
  // 유튜브 썸네일 중 가장 고화질 이미지 사용
  const backgroundImageUrl = video.snippet.thumbnails.high.url;

  return (
    <div className="hero-container" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">{title}</h1>
          <p className="hero-description">{description}</p>
          <div className="hero-buttons">
            <Link to={`/video/${videoId}`} className="hero-button play">
              ▶ 재생
            </Link>
            <Link to={`/video/${videoId}`} className="hero-button info">
              ⓘ 상세 정보
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;