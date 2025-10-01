import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // 경로가 ../App.css 여야 합니다.

const genres = [
  '스릴러', '코미디', 'SF', '드라마', '애니메이션',
  '다큐멘터리', '로맨스', '액션', '호러', '판타지'
];

function GenrePage() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigate = useNavigate();

  const handleGenreClick = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleNextClick = () => {
    if (selectedGenres.length === 0) {
      alert('하나 이상의 장르를 선택해주세요.');
      return;
    }
    navigate('/results', { state: { genres: selectedGenres } });
  };

  return (
    // 내용은 이전과 동일합니다.
    <div className="genre-container">
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