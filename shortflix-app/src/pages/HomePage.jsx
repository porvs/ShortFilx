import React, { useState, useEffect } from 'react';
import RankedCarousel from '../components/RankedCarousel';
import Carousel from '../components/Carousel';
import HeroBanner from '../components/HeroBanner';
import './HomePage.css';

function HomePage() {
  const [top10Videos, setTop10Videos] = useState([]);
  const [thrillerVideos, setThrillerVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

    const fetchAllVideos = async () => {
      try {
        const [top10Res, thrillerRes] = await Promise.all([
          // TOP 10 영화: 한국어 검색 및 언어 설정 적용
          fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent('단편 영화')}&type=video&maxResults=10&sortOrder=viewCount&videoDuration=long&regionCode=KR&relevanceLanguage=ko&key=${YOUTUBE_API_KEY}`),
          
          // 스릴러 영화
          fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=thriller short film&type=video&maxResults=10&sortOrder=viewCount&videoDuration=long&regionCode=KR&key=${YOUTUBE_API_KEY}`)
        ]);

        if (!top10Res.ok || !thrillerRes.ok) throw new Error('Failed to fetch videos');

        const top10Data = await top10Res.json();
        const thrillerData = await thrillerRes.json();

        setTop10Videos(top10Data.items);
        setThrillerVideos(thrillerData.items);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllVideos();
  }, []);

  if (loading) {
    return <div className="loading-text">콘텐츠를 불러오는 중...</div>;
  }

  const heroVideo = top10Videos.length > 0 ? top10Videos[0] : null;

  return (
    <div className="homepage-container">
      <HeroBanner video={heroVideo} />
      
      <div className="carousels-wrapper">
        <RankedCarousel title="오늘 대한민국의 TOP 10 단편 영화" videos={top10Videos} />
        <Carousel title="놓쳐서는 안 될 스릴러 단편" videos={thrillerVideos} />
      </div>
    </div>
  );
}

export default HomePage;