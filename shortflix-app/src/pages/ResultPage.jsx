import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './ResultPage.css'; // 방금 만든 CSS 파일 불러오기

function ResultPage() {
  const location = useLocation();
  const selectedGenres = location.state?.genres || [];

  // 컴포넌트의 상태 관리
  const [videos, setVideos] = useState([]); // API 결과 비디오 목록
  const [loading, setLoading] = useState(true); // 로딩 중인지 여부
  const [error, setError] = useState(null); // 에러 메시지

  // useEffect: 페이지가 처음 렌더링될 때 한 번만 실행될 로직
  useEffect(() => {
    // API 호출 함수
    const fetchVideos = async () => {
      try {
        // 1. 검색어 생성: 장르들을 조합하여 검색어를 만듭니다.
        const searchQuery = `${selectedGenres.join(' ')} short film`;
        const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

        // 2. YouTube API 호출
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=10&sortOrder=viewCount&key=${'AIzaSyDH8Z7Gg-xSp2jmZ8hQcP-J3NBiBKJ7Dro'}`
        );
        
        if (!response.ok) {
          throw new Error('YouTube API에서 데이터를 가져오는데 실패했습니다.');
        }

        const data = await response.json();
        setVideos(data.items); // 받아온 비디오 목록을 상태에 저장

      } catch (err) {
        setError(err.message); // 에러가 발생하면 에러 상태에 저장
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    if (selectedGenres.length > 0) {
      fetchVideos();
    } else {
      setLoading(false);
      setError("선택된 장르가 없습니다.");
    }

  }, [selectedGenres]); // selectedGenres가 바뀔 때마다 재실행 (이 앱에선 사실상 1번만 실행됨)

  // 로딩 중일 때 표시할 UI
  if (loading) {
    return <div className="loading-text">🔍 취향에 맞는 영화를 찾고 있어요...</div>;
  }

  // 에러 발생 시 표시할 UI
  if (error) {
    return <div className="error-text">⚠️ 이런! 에러가 발생했어요: {error}</div>;
  }

  return (
    <div className="results-container">
      <h1>'{selectedGenres.join(', ')}' 추천 결과</h1>
      <div className="results-grid">
        {videos.map((video) => (
          // TODO: 나중에는 상세 페이지로 이동하도록 Link 컴포넌트 사용
          <div key={video.id.videoId} className="video-card">
            <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
            <p className="video-card-title">{video.snippet.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultPage;