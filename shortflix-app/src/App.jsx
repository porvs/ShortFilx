import React, { useState } from 'react'; // useState 추가
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GenrePage from './pages/GenrePage';
import ResultPage from './pages/ResultPage';
import DetailPage from './pages/DetailPage';
import LandingPage from './pages/LandingPage';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
  // 인트로 종료 여부 상태
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <BrowserRouter>
      <Header />
      <main className="main-content">
        <Routes>
          {/* introFinished 상태에 따라 다른 페이지를 보여줌 */}
          <Route 
            path="/" 
            element={
              introFinished ? (
                <GenrePage />
              ) : (
                <LandingPage onFinish={() => setIntroFinished(true)} />
              )
            } 
          />
          <Route path="/results" element={<ResultPage />} />
          <Route path="/video/:videoId" element={<DetailPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;