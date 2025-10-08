import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RankedCarousel from '../components/RankedCarousel';
import HeroBanner from '../components/HeroBanner';
import Carousel from '../components/Carousel';
import '../components/Filter.css';
import './HomePage.css';

// Duration 파싱을 위한 라이브러리 (ISO 8601 형식)
import { parse as parseDuration } from 'iso8601-duration';

// 전체 장르 목록 (무작위 선택을 위해 사용)
const allGenres = [
  '스릴러', '코미디', 'SF', '드라마', '애니메이션',
  '다큐멘터리', '로맨스', '액션', '호러', '판타지',
  '미스터리', '모험', '뮤지컬', '전쟁', '가족', '범죄'
];

// 한국어 장르를 영어 검색어로 바꿔주기 위한 객체
const genreMap = {
  '스릴러': 'thriller', '코미디': 'comedy', 'SF': 'sci-fi', '드라마': 'drama', 
  '애니메이션': 'animation', '다큐멘터리': 'documentary', '로맨스': 'romance', 
  '액션': 'action', '호러': 'horror', '판타지': 'fantasy',
  '미스터리': 'mystery', '모험': 'adventure', '뮤지컬': 'musical',
  '전쟁': 'war', '가족': 'family', '범죄': 'crime'
};

// 필터 버튼 옵션
const durations = [
    { label: '전체', value: 'any' },
    { label: '4분 미만', value: 'short' },
    { label: '4-20분', value: 'medium' },
    { label: '20분 이상', value: 'long' },
];

function ResultPage() {
  const location = useLocation();
  const selectedGenres = location.state?.genres || [];
  
  const [durationFilter, setDurationFilter] = useState('any');
  
  const [selectedGenreVideos, setSelectedGenreVideos] = useState([]);
  const [randomGenre, setRandomGenre] = useState([]); // 초기값을 빈 배열로 설정
  const [randomGenreVideos, setRandomGenreVideos] = useState([]);
  const [watchedList, setWatchedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const watchedList = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
    setWatchedList(watchedList);
    
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
        
        // 검색어에 항상 '-shorts'를 포함
        const selectedSearchQuery = `${selectedEnglishGenres.join(' ')} short film -shorts`;
        const randomSearchQuery = `${randomEnglishGenre} short film -shorts`;

        const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

        const [selectedRes, randomRes] = await Promise.all([
          fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(selectedSearchQuery)}&type=video&maxResults=15&sortOrder=viewCount&videoDuration=${durationFilter}&key=${YOUTUBE_API_KEY}`),
          fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(randomSearchQuery)}&type=video&maxResults=15&sortOrder=viewCount&videoDuration=${durationFilter}&key=${YOUTUBE_API_KEY}`)
        ]);
        
        if (!selectedRes.ok || !randomRes.ok) throw new Error('YouTube API에서 데이터를 가져오는데 실패했습니다.');
        let selectedData = await selectedRes.json();
        let randomData = await randomRes.json();

        // --- 추가: 1분 미만 영상 필터링 로직 ---
        const filterShortVideos = async (items) => {
            if (!items || items.length === 0) return [];
            
            const videoIds = items.map(item => item.id.videoId).join(',');
            if (!videoIds) return [];

            const detailsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`);
            if (!detailsRes.ok) {
                console.error("Failed to fetch video details for duration check.");
                return items; // 상세 정보 가져오기 실패 시 일단 전부 반환
            }
            const detailsData = await detailsRes.json();
            const videoDurations = {};
            detailsData.items.forEach(detail => {
                const duration = parseDuration(detail.contentDetails.duration);
                // 총 초 계산: 시간 * 3600 + 분 * 60 + 초
                videoDurations[detail.id] = (duration.hours || 0) * 3600 + (duration.minutes || 0) * 60 + (duration.seconds || 0);
            });

            return items.filter(item => {
                const totalSeconds = videoDurations[item.id.videoId];
                // 1분(60초) 이상인 영상만 포함
                return totalSeconds >= 60;
            });
        };

        const filteredSelectedVideos = await filterShortVideos(selectedData.items);
        const filteredRandomVideos = await filterShortVideos(randomData.items);
        // --- 필터링 로직 끝 ---
        
        // 필터링된 영상 중 첫 10개만 사용
        setSelectedGenreVideos(filteredSelectedVideos.slice(0, 10));
        setRandomGenreVideos(filteredRandomVideos.slice(0, 10));
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllVideos();
  }, [location.state, durationFilter]);

  if (error) return <div className="error-text">⚠️ 이런! 에러가 발생했어요: {error}</div>;

  const heroVideo = selectedGenreVideos.length > 0 ? selectedGenreVideos.filter(v => !watchedList.includes(v.id.videoId))[0] || selectedGenreVideos[0] : null;

  return (
    <div className="homepage-container">
      {!loading && <HeroBanner video={heroVideo} />}
      
      <div className="carousels-wrapper">
        <div className="filter-container">
            <div className="filter-segment">
                {durations.map(d => (
                    <button 
                        key={d.value} 
                        className={`filter-button ${durationFilter === d.value ? 'active' : ''}`}
                        onClick={() => setDurationFilter(d.value)}
                    >
                        {d.label}
                    </button>
                ))}
            </div>
        </div>

        {loading ? (
            <div className="loading-text">🔍 영화 순위를 불러오고 있어요...</div>
        ) : (
            <>
                <RankedCarousel title={`'${selectedGenres.join(', ')}' 장르 TOP 10`} videos={selectedGenreVideos} watchedList={watchedList} />
                <Carousel title={`'${randomGenre}' 장르 추천, 이런 건 어떠세요?`} videos={randomGenreVideos} watchedList={watchedList} />
            </>
        )}
      </div>
    </div>
  );
}

export default ResultPage;