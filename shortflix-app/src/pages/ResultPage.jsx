import React, { useState, useEffect } from 'react'; // 'useEffect' 뒤에 '}' 추가
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import RankedCarousel from '../components/RankedCarousel';
import HeroBanner from '../components/HeroBanner';
import Carousel from '../components/Carousel';
import '../components/Filter.css';
import './HomePage.css';
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
  const [searchParams] = useSearchParams();
  
  const selectedGenres = location.state?.genres || [];
  const searchTerm = searchParams.get('search');
  
  const [durationFilter, setDurationFilter] = useState('any');
  const [videos, setVideos] = useState([]);
  const [randomGenre, setRandomGenre] = useState('');
  const [randomGenreVideos, setRandomGenreVideos] = useState([]);
  const [watchedList, setWatchedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageTitle, setPageTitle] = useState('');
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    // ... (이하 모든 코드는 이전과 동일)
    setLoading(true);
    setIsCached(false);
    const watchedList = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
    setWatchedList(watchedList);
    
    const filterShortVideos = async (items, apiKey) => {
        if (!items || items.length === 0) return [];
        const videoIds = items.map(item => item.id.videoId).join(',');
        if (!videoIds) return [];
        const detailsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`);
        if (!detailsRes.ok) return items;
        const detailsData = await detailsRes.json();
        const videoDurations = {};
        detailsData.items.forEach(detail => {
            const duration = parseDuration(detail.contentDetails.duration);
            videoDurations[detail.id] = (duration.hours || 0) * 3600 + (duration.minutes || 0) * 60 + (duration.seconds || 0);
        });
        return items.filter(item => videoDurations[item.id.videoId] >= 60);
    };

    const fetchData = async () => {
      if (!searchTerm && selectedGenres.length === 0) {
        setError("검색어나 선택된 장르가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

        if (searchTerm) {
          setPageTitle(`'${searchTerm}' 검색 결과`);
          let searchQuery = `${searchTerm} short film -shorts`;
          const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=20&sortOrder=relevance&videoDuration=${durationFilter}&key=${YOUTUBE_API_KEY}`);
          if (!response.ok) throw new Error('YouTube API에서 검색 결과를 가져오는데 실패했습니다.');
          const data = await response.json();
          const filtered = await filterShortVideos(data.items, YOUTUBE_API_KEY);
          
          setVideos(filtered.slice(0, 10));
          setRandomGenreVideos([]);
          setIsCached(false);
          localStorage.setItem('cached_videos', JSON.stringify(filtered.slice(0, 10)));

        } else {
          const availableGenres = allGenres.filter(g => !selectedGenres.includes(g));
          const random = availableGenres[Math.floor(Math.random() * availableGenres.length)] || allGenres[0];
          setRandomGenre(random);
          const selectedEnglishGenres = selectedGenres.map(g => genreMap[g] || g);
          const randomEnglishGenre = genreMap[random] || random;
          let selectedSearchQuery = `${selectedEnglishGenres.join(' ')} short film -shorts`;
          let randomSearchQuery = `${randomEnglishGenre} short film -shorts`;

          const [selectedRes, randomRes] = await Promise.all([
            fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(selectedSearchQuery)}&type=video&maxResults=15&sortOrder=viewCount&videoDuration=${durationFilter}&key=${YOUTUBE_API_KEY}`),
            fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(randomSearchQuery)}&type=video&maxResults=15&sortOrder=viewCount&videoDuration=${durationFilter}&key=${YOUTUBE_API_KEY}`)
          ]);
          
          if (!selectedRes.ok || !randomRes.ok) throw new Error('YouTube API에서 데이터를 가져오는데 실패했습니다.');
          const selectedData = await selectedRes.json();
          const randomData = await randomRes.json();
          
          const filteredSelected = await filterShortVideos(selectedData.items, YOUTUBE_API_KEY);
          const filteredRandom = await filterShortVideos(randomData.items, YOUTUBE_API_KEY);

          setVideos(filteredSelected.slice(0, 10));
          setRandomGenreVideos(filteredRandom.slice(0, 10));
          
          localStorage.setItem('cached_videos', JSON.stringify(filteredSelected.slice(0, 10)));
          localStorage.setItem('cached_random_videos', JSON.stringify(filteredRandom.slice(0, 10)));
          localStorage.setItem('cached_random_genre', random);
          setIsCached(false);
        }
      } catch (err) {
        const cachedVideos = JSON.parse(localStorage.getItem('cached_videos') || '[]');
        const cachedRandomVideos = JSON.parse(localStorage.getItem('cached_random_videos') || '[]');
        const cachedRandomGenre = localStorage.getItem('cached_random_genre') || '';

        if (cachedVideos.length > 0) {
          setVideos(cachedVideos);
          setRandomGenreVideos(cachedRandomVideos);
          setRandomGenre(cachedRandomGenre);
          setIsCached(true);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.state, durationFilter, searchTerm]);

  const mainVideos = searchTerm ? videos : videos;
  const heroVideo = mainVideos.length > 0 ? mainVideos.filter(v => !watchedList.includes(v.id.videoId))[0] || mainVideos[0] : null;

  return (
    <div className="homepage-container">
      {!loading && !searchTerm && <HeroBanner video={heroVideo} />}
      
      <div className="carousels-wrapper">
        {isCached && <p style={{textAlign: 'center', color: '#ffcc00', marginBottom: '20px'}}>
          ⚠️ API 한도 초과로 이전에 불러온 데이터를 표시합니다.
        </p>}

        <div className="filter-container">
            <div className="filter-segment">
                {durations.map(d => (
                    <button key={d.value} className={`filter-button ${durationFilter === d.value ? 'active' : ''}`} onClick={() => setDurationFilter(d.value)} >
                        {d.label}
                    </button>
                ))}
            </div>
        </div>

        {loading ? (
            <div className="loading-text">🔍 영화 목록을 불러오고 있어요...</div>
        ) : error ? (
            <div className="error-text" style={{padding: '40px 20px', textAlign: 'center'}}>⚠️ 이런! 에러가 발생했어요: {error}</div>
        ) : (
            <>
                {searchTerm ? 
                    <Carousel title={pageTitle} videos={videos} watchedList={watchedList} />
                    : 
                    <>
                        <RankedCarousel title={`${selectedGenres.join(', ')} 장르 TOP 10`} videos={mainVideos} watchedList={watchedList} />
                        {randomGenre && (
                          <Carousel title={`${randomGenre} 장르 추천, 이런 건 어떠세요?`} videos={randomGenreVideos} watchedList={watchedList} />
                        )}
                    </>
                }
            </>
        )}
      </div>
    </div>
  );
}

export default ResultPage;