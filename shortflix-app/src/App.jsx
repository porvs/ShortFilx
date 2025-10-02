import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GenrePage from './pages/GenrePage';
import ResultPage from './pages/ResultPage';
import DetailPage from './pages/DetailPage'; // DetailPage 불러오기

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GenrePage />} />
        <Route path="/results" element={<ResultPage />} />
        {/* 아래 경로를 새로 추가합니다. :videoId 부분은 동적으로 변합니다. */}
        <Route path="/video/:videoId" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;