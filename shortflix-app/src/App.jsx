import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GenrePage from './pages/GenrePage';
import ResultPage from './pages/ResultPage';
import DetailPage from './pages/DetailPage';
import HomePage from './pages/HomePage'; // HomePage 불러오기
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main-content">
        <Routes>
          {/* 기본 경로를 HomePage로 변경 */}
          <Route path="/" element={<HomePage />} /> 
          {/* 장르 선택은 별도 경로로 지정 (나중에 메뉴 등에서 접근) */}
          <Route path="/genres" element={<GenrePage />} /> 
          <Route path="/results" element={<ResultPage />} />
          <Route path="/video/:videoId" element={<DetailPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;