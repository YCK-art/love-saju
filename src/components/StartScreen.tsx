import React, { useState, useEffect } from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const bgUrl = 'https://source.unsplash.com/featured/?love,couple';

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [isFemale, setIsFemale] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFemale((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 500);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fontSize = isMobile ? '1.5rem' : '2.3rem';
  const wordFontSize = isMobile ? '1.7rem' : '2.3rem';
  const lineHeight = '1.2';
  const wordWidth = '2.2ch'; // '그녀' 기준

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      backgroundImage: `url(${bgUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* 오버레이 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.38)',
        zIndex: 1,
      }} />
      {/* 콘텐츠 */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 600,
        padding: '0 1.5rem',
      }}>
        <h1
          style={{
            color: 'white',
            fontWeight: 800,
            fontSize,
            textAlign: 'center',
            lineHeight,
            marginBottom: '2.5rem',
            letterSpacing: '-1px',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            fontFamily: "'Pretendard', 'Apple SD Gothic Neo', 'sans-serif'",
            gap: '0.2em',
            padding: 0,
          }}
        >
          <span
            style={{
              color: isFemale ? '#f472b6' : '#a5b4fc',
              fontWeight: 900,
              transition: 'color 1.2s cubic-bezier(.4,0,.2,1)',
              minWidth: '2.2ch',
              textAlign: 'right',
              display: 'inline-block',
              verticalAlign: 'baseline',
              marginRight: '0.15em',
              opacity: 1,
            }}
          >
            {isFemale ? '그녀' : '그'}
          </span>
          <span style={{verticalAlign: 'baseline', fontWeight: 800}}>
            는 당신의 운명의 상대일까요?
          </span>
        </h1>
        <button
          onClick={onStart}
          style={{
            fontSize: isMobile ? '1.05rem' : '1.35rem',
            fontWeight: 700,
            border: 'none',
            borderRadius: '2rem',
            background: 'linear-gradient(90deg, #f472b6 0%, #fbcfe8 100%)',
            color: 'white',
            padding: isMobile ? '0.9rem 2.2rem' : '1.1rem 3.5rem',
            marginTop: '1.5rem',
            boxShadow: '0 4px 24px rgba(244,114,182,0.18)',
            cursor: 'pointer',
            transition: 'background 0.2s',
            outline: 'none',
            letterSpacing: '-0.5px',
          }}
        >
          사주로 확인해보기
        </button>
      </div>
    </div>
  );
};

export default StartScreen; 