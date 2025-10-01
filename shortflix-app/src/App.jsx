import React,
 { useState } from 'react';
import './App.css'; // 방금 작성한 CSS 파일을 불러옵니다.

// 추천할 장르 목록
const genres = [
  '스릴러', '코미디', 'SF', '드라마', '애니메이션',
  '다큐멘터리', '로맨스', '액션', '호러', '판타지'
];

function App() {
  // 사용자가 선택한 장르들을 저장하는 상태 (useState)
  const [selectedGenres, setSelectedGenres] = useState([]);

  // 장르 버튼을 클릭했을 때 실행될 함수
  const handleGenreClick = (genre) => {
    // 이미 선택된 장르라면 선택 해제
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      // 새로 선택한 장르라면 목록에 추가
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // 다음 페이지로 넘어가는 버튼 클릭 시 (지금은 콘솔에 출력만)
  const handleNextClick = () => {
    if (selectedGenres.length === 0) {
      alert('하나 이상의 장르를 선택해주세요.');
      return;
    }
    console.log('선택된 장르:', selectedGenres);
    // TODO: 2단계 페이지로 이 장르 정보를 넘겨주는 로직 추가
  };


  return (
    <div className="genre-container">
      <h1>어떤 장르의 단편 영화를 좋아하세요?</h1>
      <p>선호하는 장르를 모두 선택해주세요.</p>

      <div className="genre-grid">
        {genres.map((genre) => (
          <button
            key={genre}
            // 선택된 장르인지 확인하여 'selected' 클래스를 동적으로 추가/제거
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

export default App;