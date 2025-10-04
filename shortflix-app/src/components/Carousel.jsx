import React from 'react';
import { Link } from 'react-router-dom';
import './Carousel.css';

function Carousel({ title, videos }) {
  return (
    <div className="general-carousel-container">
      <h2 className="general-carousel-title">{title}</h2>
      <div className="general-carousel-track">
        {videos.map((video) => (
          <Link to={`/video/${video.id.videoId}`} key={video.id.videoId} className="general-video-card">
            <img 
              className="general-thumbnail"
              src={video.snippet.thumbnails.medium.url} 
              alt={video.snippet.title} 
            />
            <p className="general-video-title">{video.snippet.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Carousel;