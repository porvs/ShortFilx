import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GenrePage from './pages/GenrePage';
import ResultPage from './pages/ResultPage';
import DetailPage from './pages/DetailPage';
// HomePage는 더 이상 기본 페이지가 아니므로 주석 처리하거나 삭제해도 됩니다.
// import HomePage from './pages/HomePage'; 
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main-content">
        <Routes>
          {/* 기본 경로('/')를 다시 GenrePage로 설정합니다. */}
          <Route path="/" element={<GenrePage />} />
          
          <Route path="/results" element={<ResultPage />} />
          <Route path="/video/:videoId" element={<DetailPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;