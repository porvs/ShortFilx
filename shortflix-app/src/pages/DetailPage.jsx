import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import './DetailPage.css';

function DetailPage() {
  const { videoId } = useParams();
  
  const [videoDetails, setVideoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUnplayable, setIsUnplayable] = useState(false); // 재생 불가 상태 추가
  
  const playerRef = useRef(null); // 유튜브 플레이어 객체를 담을 ref

  useEffect(() => {
    // 1. 영상 상세 정보 가져오기
    const fetchVideoDetails = async () => {
      try {
        const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}&hl=ko`
        );
        if (!response.ok) throw new Error('영상 정보를 가져오는데 실패했습니다.');
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

    // 2. YouTube Iframe Player API 스크립트 로드
    const loadYouTubeAPI = () => {
      if (!window.YT) { // 이미 로드되어 있으면 다시 로드하지 않음
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        onYouTubeIframeAPIReady();
      }
    };

    // 3. API가 준비되면 플레이어 생성
    const onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('player', {
        height: '390',
        width: '640',
        videoId: videoId,
        playerVars: {
          'autoplay': 1,
        },
        events: {
          'onError': onPlayerError
        }
      });
    };

    // 4. 플레이어 에러 처리 함수
    const onPlayerError = (event) => {
      // 에러 코드 100, 101, 150은 보통 퍼가기 금지 관련 에러
      if (event.data === 100 || event.data === 101 || event.data === 150) {
        setIsUnplayable(true); // 재생 불가 상태로 변경
      }
    };
    
    fetchVideoDetails();
    if (!isUnplayable) {
        loadYouTubeAPI();
    }

    // 컴포넌트가 사라질 때 플레이어 정리
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
            {/* isUnplayable 상태에 따라 재생 불가 화면 표시 */}
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