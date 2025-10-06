import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RankedCarousel from '../components/RankedCarousel';
import HeroBanner from '../components/HeroBanner';
import './HomePage.css';

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
  const [watchedList, setWatchedList] = useState([]); // 시청 기록 state 추가
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 시청 기록을 불러와 state에 저장
    const loadedWatchedList = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
    setWatchedList(loadedWatchedList);

    const fetchAllVideos = async () => {
      if (selectedGenres.length === 0) {
        setError("선택된 장르가 없습니다.");
        setLoading(false);
        return;
      }
      try {
        const availableGenres = allGenres.filter(g => !selectedGenres.includes(g));
        const random = availableGenres[Math.floor(Math.random() * availableGenres.length)] || allGenres[0];
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

        // 영상을 필터링(제거)하는 대신, 전체 목록을 그대로 저장
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

  const heroVideo = selectedGenreVideos.length > 0 ? selectedGenreVideos.filter(v => !watchedList.includes(v.id.videoId))[0] || selectedGenreVideos[0] : null;


  return (
    <div className="homepage-container">
      <HeroBanner video={heroVideo} />
      
      <div className="carousels-wrapper">
        {/* Carousel에 watchedList를 prop으로 전달 */}
        <RankedCarousel title={`'${selectedGenres.join(', ')}' 장르 TOP 10`} videos={selectedGenreVideos} watchedList={watchedList} />
        <RankedCarousel title={`'${randomGenre}' 장르 TOP 10, 이런 건 어떠세요?`} videos={randomGenreVideos} watchedList={watchedList} />
      </div>
    </div>
  );
}

export default ResultPage;