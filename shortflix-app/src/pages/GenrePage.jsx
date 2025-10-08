import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

// 추천할 장르 목록 (16개로 확장)
const genres = [
  '스릴러', '코미디', 'SF', '드라마', '애니메이션',
  '다큐멘터리', '로맨스', '액션', '호러', '판타지',
  '미스터리', '모험', '뮤지컬', '전쟁', '가족', '범죄'
];

function GenrePage() {
  // 사용자가 선택한 장르들을 저장하는 상태 (useState)
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigate = useNavigate();

  // 장르 버튼을 클릭했을 때 실행될 함수
  const handleGenreClick = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // 다음 페이지로 넘어가는 버튼 클릭 시
  const handleNextClick = () => {
    if (selectedGenres.length === 0) {
      alert('하나 이상의 장르를 선택해주세요.');
      return;
    }
    // 장르 정보만 전달합니다.
    navigate('/results', { state: { genres: selectedGenres } });
  };

  return (
    // 최상위 div의 클래스 이름을 genre-content로 변경
    <div className="genre-content">
      <h1>어떤 장르의 단편 영화를 좋아하세요?</h1>
      <p>선호하는 장르를 모두 선택해주세요.</p>
      <div className="genre-grid">
        {genres.map((genre) => (
          <button
            key={genre}
            className={`genre-button ${selectedGenres.includes(genre) ? 'selected' : ''}`}
            onClick={() => handleGenreClick(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      <button className="next-button" onClick={handleNextClick}>
         추천 받기
      </button>
    </div>
  );
}

export default GenrePage;