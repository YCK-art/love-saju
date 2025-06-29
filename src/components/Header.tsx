import React, { useState } from 'react';
import { AuthUser, signInWithGoogle, signOutUser } from '../utils/authManager';

interface HeaderProps {
  user: AuthUser | null;
  onUserChange: (user: AuthUser | null) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onUserChange }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const authUser = await signInWithGoogle();
      onUserChange(authUser);
    } catch (error) {
      console.error('로그인 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOutUser();
      onUserChange(null);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 모바일 감지
  const isMobile = window.innerWidth < 700;

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      right: 0,
      left: 0,
      zIndex: 1000,
      background: 'linear-gradient(135deg, #ffe5f1 0%, #f3e5f5 100%)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(236, 72, 153, 0.08)',
      padding: '1rem 1.5rem',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    }}>
      {user ? (
        // 로그인된 상태
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #fdf2f8 0%, #faf5ff 100%)',
            borderRadius: '2rem',
            border: '1px solid #fce7f3',
          }}>
            {user.photoURL && (
              <img 
                src={user.photoURL} 
                alt="프로필" 
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            )}
            <span style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#ec4899',
            }}>
              {user.displayName || user.email}
            </span>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            style={{
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #fef2f2 0%, #fdf2f8 100%)',
              border: '1px solid #fecaca',
              borderRadius: '1.5rem',
              color: '#ef4444',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.3s ease',
            }}
          >
            {isLoading ? '로그아웃 중...' : '로그아웃'}
          </button>
        </div>
      ) : (
        // 로그인되지 않은 상태
        <button
          onClick={handleLogin}
          disabled={isLoading}
          style={{
            padding: isMobile ? '0.55rem 1rem' : '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
            border: 'none',
            borderRadius: '2rem',
            color: 'white',
            fontSize: isMobile ? '0.85rem' : '0.95rem',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '0.3rem' : '0.5rem',
          }}
        >
          {isLoading ? (
            <>
              <div style={{
                width: isMobile ? '0.8rem' : '1rem',
                height: isMobile ? '0.8rem' : '1rem',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              로그인 중...
            </>
          ) : (
            <>
              <span style={{ fontSize: isMobile ? '0.95rem' : '1.1rem' }}>🔐</span>
              Google로 로그인
            </>
          )}
        </button>
      )}
    </header>
  );
};

export default Header; 