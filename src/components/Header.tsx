import React, { useState, useRef, useEffect } from 'react';
import { AuthUser, signInWithGoogle, signOutUser } from '../utils/authManager';

interface HeaderProps {
  user: AuthUser | null;
  onUserChange: (user: AuthUser | null) => void;
}

// 내 정보 타입
interface MyProfile {
  name: string;
  gender: '남자' | '여자';
  birthDate: string;
  birthTime: string;
}

const defaultProfile: MyProfile = {
  name: '',
  gender: '남자',
  birthDate: '',
  birthTime: ''
};

const LOCAL_KEY = 'my_profile';

const Header: React.FC<HeaderProps> = ({ user, onUserChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState<MyProfile>(defaultProfile);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 모바일 감지
  const isMobile = window.innerWidth < 700;

  // 내 정보 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

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

  // 계정전환: 새 계정 로그인 성공 시에만 로그아웃/상태 갱신
  const handleSwitchAccount = async () => {
    setIsLoading(true);
    try {
      const authUser = await signInWithGoogle();
      if (authUser) {
        await signOutUser(); // 기존 계정 로그아웃
        onUserChange(authUser); // 새 계정으로 상태 갱신
      }
      // 로그인 팝업 취소 시 아무 변화 없음
      setDropdownOpen(false);
    } catch (error) {
      console.error('계정전환 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 확인
  const handleLogout = async () => {
    setShowLogoutConfirm(true);
  };
  const confirmLogout = async () => {
    setIsLoading(true);
    try {
      await signOutUser();
      onUserChange(null);
      setDropdownOpen(false);
      setShowLogoutConfirm(false);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // 내 정보 저장
  const handleProfileSave = () => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(profile));
    setShowProfileModal(false);
    alert('내 정보가 저장되었습니다!');
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
          <div
            ref={dropdownRef}
            style={{ position: 'relative', cursor: 'pointer' }}
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #fdf2f8 0%, #faf5ff 100%)',
              borderRadius: '2rem',
              border: '1px solid #fce7f3',
              fontWeight: 600,
              color: '#ec4899',
              fontSize: '0.9rem',
              minWidth: '90px',
              userSelect: 'none',
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
              <span>{user.displayName || user.email}</span>
              <span style={{ fontSize: '1.1rem', color: '#d1a5f7', marginLeft: '0.2rem' }}>▼</span>
            </div>
            {/* 드롭다운 메뉴 */}
            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  background: 'white',
                  borderRadius: '1rem',
                  boxShadow: '0 4px 24px rgba(236,72,153,0.13)',
                  border: '1px solid #f3e5f5',
                  minWidth: '150px',
                  zIndex: 2000,
                  padding: '0.5rem 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                  fontWeight: 500,
                  fontSize: '0.97rem',
                  color: '#6b7280',
                  animation: 'fadeIn 0.2s',
                }}
              >
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    padding: '0.7rem 1.2rem',
                    width: '100%',
                    cursor: 'pointer',
                    color: '#8b5cf6',
                    fontWeight: 600,
                  }}
                  onClick={e => { e.stopPropagation(); setDropdownOpen(false); setShowProfileModal(true); }}
                >
                  설정
                </button>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    padding: '0.7rem 1.2rem',
                    width: '100%',
                    cursor: 'pointer',
                    color: '#f472b6',
                    fontWeight: 600,
                  }}
                  onClick={e => { e.stopPropagation(); setDropdownOpen(false); handleSwitchAccount(); }}
                >
                  계정전환
                </button>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    padding: '0.7rem 1.2rem',
                    width: '100%',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    color: '#ef4444',
                    fontWeight: 600,
                    opacity: isLoading ? 0.6 : 1,
                  }}
                  onClick={e => { e.stopPropagation(); handleLogout(); }}
                  disabled={isLoading}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
          {/* 내 정보 입력 모달 */}
          {showProfileModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              background: 'rgba(0,0,0,0.25)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
              onClick={() => setShowProfileModal(false)}
            >
              <div
                style={{
                  background: 'white', borderRadius: '1.5rem', boxShadow: '0 8px 32px rgba(236,72,153,0.13)', padding: '2rem 1.5rem', minWidth: 300, maxWidth: '90vw', position: 'relative',
                }}
                onClick={e => e.stopPropagation()}
              >
                <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#ec4899', marginBottom: '1.2rem', textAlign: 'center' }}>내 정보 설정</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontWeight: 600, color: '#8b5cf6', fontSize: '0.97rem' }}>이름</label>
                    <input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '0.7rem', border: '1px solid #e5e7eb', marginTop: '0.3rem' }} placeholder="이름을 입력하세요" />
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, color: '#8b5cf6', fontSize: '0.97rem' }}>성별</label>
                    <select value={profile.gender} onChange={e => setProfile(p => ({ ...p, gender: e.target.value as '남자' | '여자' }))} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '0.7rem', border: '1px solid #e5e7eb', marginTop: '0.3rem' }}>
                      <option value="남자">남자</option>
                      <option value="여자">여자</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, color: '#8b5cf6', fontSize: '0.97rem' }}>생년월일</label>
                    <input type="date" value={profile.birthDate} onChange={e => setProfile(p => ({ ...p, birthDate: e.target.value }))} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '0.7rem', border: '1px solid #e5e7eb', marginTop: '0.3rem' }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, color: '#8b5cf6', fontSize: '0.97rem' }}>태어난 시간 (선택)</label>
                    <input type="time" value={profile.birthTime} onChange={e => setProfile(p => ({ ...p, birthTime: e.target.value }))} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '0.7rem', border: '1px solid #e5e7eb', marginTop: '0.3rem' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center' }}>
                  <button onClick={handleProfileSave} style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: 'white', border: 'none', borderRadius: '1rem', padding: '0.8rem 2.2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>저장</button>
                  <button onClick={() => setShowProfileModal(false)} style={{ background: '#f3e5f5', color: '#8b5cf6', border: 'none', borderRadius: '1rem', padding: '0.8rem 2.2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>취소</button>
                </div>
              </div>
            </div>
          )}
          {/* 로그아웃 확인 모달 */}
          {showLogoutConfirm && (
            <div style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              background: 'rgba(0,0,0,0.25)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
              onClick={cancelLogout}
            >
              <div
                style={{
                  background: 'white', borderRadius: '1.5rem', boxShadow: '0 8px 32px rgba(236,72,153,0.13)', padding: '2rem 1.5rem', minWidth: 300, maxWidth: '90vw', position: 'relative', textAlign: 'center'
                }}
                onClick={e => e.stopPropagation()}
              >
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ec4899', marginBottom: '1.2rem' }}>정말 로그아웃하시겠습니까?</h2>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center' }}>
                  <button onClick={confirmLogout} style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: 'white', border: 'none', borderRadius: '1rem', padding: '0.8rem 2.2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>로그아웃</button>
                  <button onClick={cancelLogout} style={{ background: '#f3e5f5', color: '#8b5cf6', border: 'none', borderRadius: '1rem', padding: '0.8rem 2.2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>취소</button>
                </div>
              </div>
            </div>
          )}
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