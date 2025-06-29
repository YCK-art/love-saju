import React, { useState, useEffect } from 'react';

const Loading: React.FC = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      {/* 로딩 애니메이션 */}
      <div className="loading-spinner"></div>

      {/* 메시지 */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          운명을 해석하는 중입니다{dots}
        </h2>
        <p style={{ color: '#6b7280', maxWidth: '20rem', lineHeight: '1.5' }}>
          당신과 그 사람의 사주를 분석하여<br />
          가장 정확한 연애운을 알려드릴게요
        </p>
      </div>

      {/* 추가 로딩 메시지들 */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
          천간과 지지를 분석 중...
        </div>
        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '0.3s' }}>
          오행의 조화를 확인 중...
        </div>
        <div style={{ fontSize: '0.875rem', color: '#6b7280', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: '0.7s' }}>
          연애운을 계산 중...
        </div>
      </div>

      {/* 하단 장식 */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
        <div style={{ width: '0.5rem', height: '0.5rem', backgroundColor: '#fce7f3', borderRadius: '50%', animation: 'bounce 1s infinite' }}></div>
        <div style={{ width: '0.5rem', height: '0.5rem', backgroundColor: '#f3e8ff', borderRadius: '50%', animation: 'bounce 1s infinite', animationDelay: '0.1s' }}></div>
        <div style={{ width: '0.5rem', height: '0.5rem', backgroundColor: '#fce7f3', borderRadius: '50%', animation: 'bounce 1s infinite', animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default Loading; 