import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GenrePage from './pages/GenrePage';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GenrePage />} />
        <Route path="/results" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;