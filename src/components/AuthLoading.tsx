import React from 'react';

const AuthLoading: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: '2.5rem',
        height: '2.5rem',
        border: '4px solid #f3e5f5',
        borderTop: '4px solid #ec4899',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '1.2rem',
      }} />
      <div style={{ color: '#a78bfa', fontWeight: 600, fontSize: '1.1rem' }}>로그인 상태 확인 중...</div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthLoading; 