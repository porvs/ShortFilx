import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DetailPage.css';

function DetailPage() {
  const { videoId } = useParams();
  
  const [videoDetails, setVideoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
        
        // YouTube API 호출 URL에 &hl=ko 파라미터 추가
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}&hl=ko`
        );

        if (!response.ok) {
          throw new Error('YouTube API에서 영상 정보를 가져오는데 실패했습니다.');
        }

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

    fetchVideoDetails();
  }, [videoId]);

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
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
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