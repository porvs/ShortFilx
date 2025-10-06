import React from 'react';
import { Link } from 'react-router-dom';
import './RankedCarousel.css';

// watchedList prop을 추가로 받음
function RankedCarousel({ title, videos, watchedList = [] }) {
  return (
    <div className="carousel-container">
      <h2 className="carousel-title">{title}</h2>
      <div className="carousel-track">
        {videos.map((video, index) => {
          // 현재 비디오가 시청 목록에 있는지 확인
          const isWatched = watchedList.includes(video.id.videoId);
          
          return (
            // isWatched 값에 따라 'watched' 클래스 추가
            <Link to={`/video/${video.id.videoId}`} key={video.id.videoId} className={`rank-item ${isWatched ? 'watched' : ''}`}>
              <span className="rank-number">{index + 1}</span>
              <div className="thumbnail-wrapper">
                <img 
                  className="rank-thumbnail"
                  src={video.snippet.thumbnails.medium.url} 
                  alt={video.snippet.title} 
                />
                {/* isWatched가 true일 때만 '이미 시청함' 오버레이 표시 */}
                {isWatched && (
                  <div className="watched-overlay">
                    <span>이미 시청함</span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default RankedCarousel;