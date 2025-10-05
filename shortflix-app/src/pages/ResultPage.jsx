import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RankedCarousel from '../components/RankedCarousel';
import HeroBanner from '../components/HeroBanner'; // HeroBanner 컴포넌트 불러오기
import './HomePage.css'; // HomePage의 대시보드 레이아웃 스타일을 재사용합니다.

const allGenres = [
  '스릴러', '코미디', 'SF', '드라마', '애니메이션',
  '다큐멘터리', '로맨스', '액션', '호러', '판타지'
];

const genreMap = {
  '스릴러': 'thriller', '코미디': 'comedy', 'SF': 'sci-fi', '드라마': 'drama', 
  '애니메이션': 'animation', '다큐멘터리': 'documentary', '로맨스': 'romance', 
  '액션': 'action', '호러': 'horror', '판타지': 'fantasy'
};

function ResultPage() {
  const location = useLocation();
  const selectedGenres = location.state?.genres || [];

  const [selectedGenreVideos, setSelectedGenreVideos] = useState([]);
  const [randomGenre, setRandomGenre] = useState('');
  const [randomGenreVideos, setRandomGenreVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllVideos = async () => {
      // ... (이전과 동일한 API 호출 로직)
      if (selectedGenres.length === 0) {
        setError("선택된 장르가 없습니다.");
        setLoading(false);
        return;
      }
      try {
        const availableGenres = allGenres.filter(g => !selectedGenres.includes(g));
        const random = availableGenres[Math.floor(Math.random() * availableGenres.length)];
        setRandomGenre(random);
        const selectedEnglishGenres = selectedGenres.map(g => genreMap[g] || g);
        const randomEnglishGenre = genreMap[random] || random;
        const selectedSearchQuery = `${selectedEnglishGenres.join(' ')} short film`;
        const randomSearchQuery = `${randomEnglishGenre} short film`;
        const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
        const [selectedRes, randomRes] = await Promise.all([
          fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(selectedSearchQuery)}&type=video&maxResults=10&sortOrder=viewCount&videoDuration=long&key=${YOUTUBE_API_KEY}`),
          fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(randomSearchQuery)}&type=video&maxResults=10&sortOrder=viewCount&videoDuration=long&key=${YOUTUBE_API_KEY}`)
        ]);
        if (!selectedRes.ok || !randomRes.ok) throw new Error('YouTube API에서 데이터를 가져오는데 실패했습니다.');
        const selectedData = await selectedRes.json();
        const randomData = await randomRes.json();
        setSelectedGenreVideos(selectedData.items);
        setRandomGenreVideos(randomData.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllVideos();
  }, [location.state]);

  if (loading) return <div className="loading-text">🔍 맞춤 콘텐츠를 구성하고 있어요...</div>;
  if (error) return <div className="error-text">⚠️ 이런! 에러가 발생했어요: {error}</div>;

  // 선택한 장르의 TOP 1 영상을 히어로 배너의 주인공으로 설정
  const heroVideo = selectedGenreVideos.length > 0 ? selectedGenreVideos[0] : null;

  return (
    <div className="homepage-container">
      {/* 1. 히어로 배너 */}
      <HeroBanner video={heroVideo} />
      
      <div className="carousels-wrapper">
        {/* 2. 사용자가 선택한 장르의 TOP 10 */}
        <RankedCarousel title={`'${selectedGenres.join(', ')}' 장르 TOP 10`} videos={selectedGenreVideos} />
        
        {/* 3. 무작위로 추천된 장르의 TOP 10 */}
        <RankedCarousel title={`'${randomGenre}' 장르 TOP 10, 이런 건 어떠세요?`} videos={randomGenreVideos} />
      </div>
    </div>
  );
}

export default ResultPage;