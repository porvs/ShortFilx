import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RankedCarousel from '../components/RankedCarousel'; // TOP 10 스타일 컴포넌트 불러오기

// 한국어 장르를 영어 검색어로 바꿔주기 위한 객체
const genreMap = {
  '스릴러': 'thriller',
  '코미디': 'comedy',
  'SF': 'sci-fi',
  '드라마': 'drama',
  '애니메이션': 'animation',
  '다큐멘터리': 'documentary',
  '로맨스': 'romance',
  '액션': 'action',
  '호러': 'horror',
  '판타지': 'fantasy'
};

function ResultPage() {
  const location = useLocation();
  const selectedGenres = location.state?.genres || [];

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      if (selectedGenres.length === 0) {
        setError("선택된 장르가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        // 선택된 한국어 장르들을 영어로 변환
        const englishGenres = selectedGenres.map(genre => genreMap[genre] || genre);
        const searchQuery = `${englishGenres.join(' ')} short film`;
        const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

        // regionCode, relevanceLanguage를 제거하여 전 세계적으로 검색
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
  }, [location.state]);

  if (loading) return <div className="loading-text">🔍 영화 순위를 불러오고 있어요...</div>;
  if (error) return <div className="error-text">⚠️ 이런! 에러가 발생했어요: {error}</div>;

  return (
    <div className="homepage-container">
        {/* UI를 RankedCarousel 컴포넌트로 변경 */}
        <RankedCarousel title={`'${selectedGenres.join(', ')}' 장르 TOP 10`} videos={videos} />
    </div>
  );
}

export default ResultPage;