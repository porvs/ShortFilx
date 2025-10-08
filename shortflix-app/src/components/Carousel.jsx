import React from 'react';
import { Link } from 'react-router-dom';
import './Carousel.css';

// watchedList prop을 추가로 받도록 수정
function Carousel({ title, videos, watchedList = [] }) {
  return (
    <div className="general-carousel-container">
      <h2 className="general-carousel-title">{title}</h2>
      <div className="general-carousel-track">
        {videos.map((video) => {
          // 현재 비디오가 시청 목록에 있는지 확인
          const isWatched = watchedList.includes(video.id.videoId);

          return (
            // isWatched 값에 따라 'watched' 클래스 추가
            <Link to={`/video/${video.id.videoId}`} key={video.id.videoId} className={`general-video-card ${isWatched ? 'watched' : ''}`}>
              <div className="general-thumbnail-wrapper">
                <img 
                  className="general-thumbnail"
                  src={video.snippet.thumbnails.medium.url} 
                  alt={video.snippet.title} 
                />
                {/* isWatched가 true일 때만 '이미 시청함' 오버레이 표시 */}
                {isWatched && (
                  <div className="general-watched-overlay">
                    <span>이미 시청함</span>
                  </div>
                )}
              </div>
              <p className="general-video-title">{video.snippet.title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Carousel;