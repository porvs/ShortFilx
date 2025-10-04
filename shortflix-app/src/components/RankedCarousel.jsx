import React from 'react';
import { Link } from 'react-router-dom';
import './RankedCarousel.css';

function RankedCarousel({ title, videos }) {
  return (
    <div className="carousel-container">
      <h2 className="carousel-title">{title}</h2>
      <div className="carousel-track">
        {videos.map((video, index) => (
          <Link to={`/video/${video.id.videoId}`} key={video.id.videoId} className="rank-item">
            <span className="rank-number">{index + 1}</span>
            <img 
              className="rank-thumbnail"
              src={video.snippet.thumbnails.medium.url} 
              alt={video.snippet.title} 
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RankedCarousel;