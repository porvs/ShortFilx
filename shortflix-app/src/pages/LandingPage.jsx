import React, { useState, useEffect, useRef } from 'react';
// GenrePage import는 더 이상 필요 없으므로 삭제
import './LandingPage.css';

// onFinish 함수를 props로 받음
function LandingPage({ onFinish }) {
  const audioRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden'; // 스크롤 막기

    try {
        audioRef.current.muted = true;
        audioRef.current.play().catch(() => {});
    } catch(e) {}

    // 3초 후, App 컴포넌트에게 애니메이션이 끝났다고 알림
    const introTimer = setTimeout(() => {
      onFinish();
    }, 3000); // CSS 애니메이션 시간과 일치

    return () => {
      clearTimeout(introTimer);
      document.body.style.overflow = 'auto'; // 스크롤 복원
    };
  }, [onFinish]);

  return (
    <div className="landing-container">
      <audio ref={audioRef} src="/intro-sound.mp3" preload="auto" muted></audio>
      <div className="animation-viewport">
        <div className="logo-s-scroll">S</div>
      </div>
    </div>
  );
}

export default LandingPage;