import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './ResultPage.css';

function ResultPage() {
  const location = useLocation();
  const selectedGenres = location.state?.genres || [];

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const searchQuery = `${selectedGenres.join(' ')} short film`;
        const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

        const youtubeResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            searchQuery
          )}&type=video&maxResults=5&sortOrder=viewCount&videoDuration=long&key=${YOUTUBE_API_KEY}`
        );
        
        if (!youtubeResponse.ok) {
          throw new Error('YouTube API에서 데이터를 가져오는데 실패했습니다.');
        }
        // 바로 이 부분의 'response'를 'youtubeResponse'로 수정했습니다.
        const youtubeData = await youtubeResponse.json(); 
        
        setVideos(youtubeData.items);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedGenres.length > 0) {
      fetchVideos();
    } else {
      setLoading(false);
      setError("선택된 장르가 없습니다.");
    }
  }, [selectedGenres]);

  if (loading) {
    return <div className="loading-text">🔍 취향에 맞는 영화를 찾고 있어요...</div>;
  }

  if (error) {
    return <div className="error-text">⚠️ 이런! 에러가 발생했어요: {error}</div>;
  }

  return (
    <div className="results-container">
      <h1>'{selectedGenres.join(', ')}' 추천 결과</h1>
      <div className="results-grid">
        {videos.map((video) => (
          <Link to={`/video/${video.id.videoId}`} key={video.id.videoId} className="video-card">
            <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
            <p className="video-card-title">{video.snippet.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ResultPage;