import React, { useState, useEffect } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import './ResultPage.css';

function ResultPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // URL에서 검색어 가져오기 (예: /results?search=space)
  const searchTerm = searchParams.get('search');
  // 이전 방식의 장르 목록 가져오기
  const selectedGenres = location.state?.genres || [];

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        let searchQuery = '';
        // 검색어가 있으면 검색어를 우선 사용, 없으면 장르 선택 결과를 사용
        if (searchTerm) {
          setTitle(`'${searchTerm}' 검색 결과`);
          searchQuery = `${searchTerm} short film`;
        } else if (selectedGenres.length > 0) {
          setTitle(`'${selectedGenres.join(', ')}' 추천 결과`);
          searchQuery = `${selectedGenres.join(' ')} short film`;
        } else {
          throw new Error("검색어나 선택된 장르가 없습니다.");
        }

        const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            searchQuery
          )}&type=video&maxResults=10&sortOrder=viewCount&videoDuration=long&key=${YOUTUBE_API_KEY}`
        );

        if (!response.ok) throw new Error('YouTube API에서 데이터를 가져오는데 실패했습니다.');
        const data = await response.json();
        setVideos(data.items);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchTerm, location.state]); // searchTerm이나 location.state가 바뀔 때마다 재실행

  if (loading) return <div className="loading-text">🔍 검색 결과를 찾고 있어요...</div>;
  if (error) return <div className="error-text">⚠️ 이런! 에러가 발생했어요: {error}</div>;

  return (
    <div className="results-container">
      <h1>{title}</h1>
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