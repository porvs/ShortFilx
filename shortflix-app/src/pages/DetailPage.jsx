import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import './DetailPage.css';

function DetailPage() {
  const { videoId } = useParams();
  
  const [videoDetails, setVideoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUnplayable, setIsUnplayable] = useState(false);
  
  const playerRef = useRef(null);

  useEffect(() => {
    // --- 시청 기록 저장 로직 ---
    try {
      const watchedList = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
      if (!watchedList.includes(videoId)) {
        watchedList.push(videoId);
        localStorage.setItem('watchedVideos', JSON.stringify(watchedList));
      }
    } catch (e) {
      console.error("Failed to update watch history:", e);
    }
    // --- 시청 기록 저장 로직 끝 ---

    const fetchVideoDetails = async () => {
      try {
        const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}&hl=ko`
        );
        if (!response.ok) throw new Error('YouTube API에서 영상 정보를 가져오는데 실패했습니다.');
        const data = await response.json();
        if (data.items.length > 0) {
          setVideoDetails(data.items[0]);
        } else {
          throw new Error('해당 ID의 영상을 찾을 수 없습니다.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        onYouTubeIframeAPIReady();
      }
    };

    const onYouTubeIframeAPIReady = () => {
      if(playerRef.current) {
        playerRef.current.destroy();
      }
      playerRef.current = new window.YT.Player('player', {
        height: '390',
        width: '640',
        videoId: videoId,
        playerVars: { 'autoplay': 1 },
        events: { 'onError': onPlayerError }
      });
    };

    const onPlayerError = (event) => {
      if (event.data === 100 || event.data === 101 || event.data === 150) {
        setIsUnplayable(true);
      }
    };
    
    fetchVideoDetails();
    if (!isUnplayable) {
        loadYouTubeAPI();
    }

    return () => {
        if(playerRef.current && playerRef.current.destroy) {
            playerRef.current.destroy();
        }
        window.onYouTubeIframeAPIReady = null;
    }

  }, [videoId, isUnplayable]);

  if (loading) {
    return <div className="detail-container"><p className="detail-loading-text">영상 정보를 불러오는 중...</p></div>;
  }

  if (error) {
    return <div className="detail-container"><p className="detail-error-text">⚠️ 이런! 에러가 발생했어요: {error}</p></div>;
  }

  return (
    <div className="detail-container">
      <div className="video-player-wrapper">
        <div className="youtube-player">
            {isUnplayable ? (
                <div className="unplayable-overlay">
                    <p>이 동영상은 YouTube에서만 시청할 수 있습니다.</p>
                    <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer" className="youtube-link-button">
                        YouTube에서 보기
                    </a>
                </div>
            ) : (
                <div id="player"></div>
            )}
        </div>
        <div className="video-info">
            <h1>{videoDetails?.snippet?.title}</h1>
            <p>{videoDetails?.snippet?.description}</p>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;