import React, { useState, useEffect } from 'react';
import { PersonInfo } from '../App';

interface InputFormProps {
  onStartReading: (user: PersonInfo, crush: PersonInfo) => void;
  authUser?: { uid: string } | null;
  userInfoOverride?: PersonInfo | null;
}

const InputForm: React.FC<InputFormProps> = ({ onStartReading, authUser, userInfoOverride }) => {
  // 2000년을 기본값으로 설정
  const defaultDate = '2000-01-01';
  const LOCAL_KEY = 'my_profile';
  
  const defaultUserInfo: PersonInfo = {
    name: '',
    gender: '여자',
    birthDate: defaultDate,
    birthTime: ''
  };

  const [userInfo, setUserInfo] = useState<PersonInfo>(defaultUserInfo);
  const [crushInfo, setCrushInfo] = useState<PersonInfo>({
    name: '',
    gender: '남자',
    birthDate: defaultDate,
    birthTime: ''
  });

  // 내 정보 자동 입력 (계정별 localStorage)
  useEffect(() => {
    const profileKey = authUser?.uid ? `${LOCAL_KEY}_${authUser.uid}` : LOCAL_KEY;
    const saved = localStorage.getItem(profileKey);
    if (saved) {
      const profile = JSON.parse(saved);
      setUserInfo({
        name: profile.name || '',
        gender: profile.gender || '여자',
        birthDate: profile.birthDate || defaultDate,
        birthTime: profile.birthTime || ''
      });
    } else {
      // 계정별 설정이 없으면 기본값으로 초기화
      setUserInfo(defaultUserInfo);
    }
  }, [authUser?.uid]);

  // 로그아웃 시 내 정보 입력란 초기화
  useEffect(() => {
    if (!authUser) {
      setUserInfo(defaultUserInfo);
    }
  }, [authUser]);

  // 내 정보 성별에 따라 상대방 성별 자동 설정
  useEffect(() => {
    setCrushInfo(prev => ({
      ...prev,
      gender: userInfo.gender === '남자' ? '여자' : '남자'
    }));
    // eslint-disable-next-line
  }, [userInfo.gender]);

  // userInfoOverride가 바뀌면 즉시 반영
  useEffect(() => {
    if (userInfoOverride) {
      setUserInfo(userInfoOverride);
    }
  }, [userInfoOverride]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.name && userInfo.birthDate && crushInfo.name && crushInfo.birthDate) {
      onStartReading(userInfo, crushInfo);
    }
  };

  const updateUserInfo = (field: keyof PersonInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const updateCrushInfo = (field: keyof PersonInfo, value: string) => {
    setCrushInfo(prev => ({ ...prev, [field]: value }));
  };

  // 반응형: 모바일에서 가로폭 줄이기
  const isMobile = window.innerWidth <= 700;
  const titleFontSize = isMobile ? '1.3rem' : '1.875rem';
  const subtitleMarginBottom = isMobile ? '1.2rem' : '0.5rem';
  const containerStyle = {
    maxWidth: isMobile ? '90vw' : '25vw',
    minWidth:  isMobile ? 0 : 320,
    width: isMobile ? '90vw' : undefined,
    margin: '0 auto',
    minHeight: 'calc(100vh - 120px)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center' as const,
    paddingTop: isMobile ? 80 : 120, // PC도 충분히 아래로 내림
    paddingBottom: isMobile ? 40 : 0,
  };
  const cardAndButtonStyle = {
    width: isMobile ? '66vw' : '100%',
    margin: isMobile ? '0 auto' : undefined
  };
  const cardStyle = {
    ...cardAndButtonStyle,
    marginBottom: isMobile ? 32 : 24, // 카드(입력란) 사이 여유 간격
  };
  const buttonStyle = {
    ...cardAndButtonStyle,
    marginTop: isMobile ? 32 : 24, // 버튼과 입력란 사이 여유 간격
  };

  return (
    <div
      style={containerStyle}
      className="space-y-6"
    >
      {/* 헤더 */}
      <div className="text-center">
        <h1 style={{ fontSize: titleFontSize, fontWeight: 'bold', color: '#1f2937', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <span role="img" aria-label="love">💕</span> 연애 사주풀이
        </h1>
        <p style={{ color: '#6b7280', marginBottom: subtitleMarginBottom }}>당신과 그 사람의 운명을 알아보세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" style={cardAndButtonStyle}>
        {/* 내 정보 */}
        <div className="card" style={cardStyle}>
          <div className="card-header">
            <span className="icon">👤</span>
            내 정보
          </div>
          
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">이름</label>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => updateUserInfo('name', e.target.value)}
                className="form-input"
                placeholder="이름을 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">성별</label>
              <select
                value={userInfo.gender}
                onChange={(e) => updateUserInfo('gender', e.target.value as '남자' | '여자')}
                className="form-select"
              >
                <option value="남자">남자</option>
                <option value="여자">여자</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">생년월일</label>
              <input
                type="date"
                value={userInfo.birthDate}
                onChange={(e) => updateUserInfo('birthDate', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">태어난 시간 (선택사항)</label>
              <input
                type="time"
                value={userInfo.birthTime}
                onChange={(e) => updateUserInfo('birthTime', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* 상대방 정보 */}
        <div className="card" style={cardStyle}>
          <div className="card-header">
            <span className="icon">💝</span>
            상대방 정보
          </div>
          
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">이름</label>
              <input
                type="text"
                value={crushInfo.name}
                onChange={(e) => updateCrushInfo('name', e.target.value)}
                className="form-input"
                placeholder="상대방 이름을 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">성별</label>
              <select
                value={crushInfo.gender}
                onChange={(e) => updateCrushInfo('gender', e.target.value as '남자' | '여자')}
                className="form-select"
              >
                <option value="남자">남자</option>
                <option value="여자">여자</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">생년월일</label>
              <input
                type="date"
                value={crushInfo.birthDate}
                onChange={(e) => updateCrushInfo('birthDate', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">태어난 시간 (선택사항)</label>
              <input
                type="time"
                value={crushInfo.birthTime}
                onChange={(e) => updateCrushInfo('birthTime', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <button type="submit" className="btn btn-primary" style={buttonStyle}>
          🔮 사주풀이 시작하기
        </button>
      </form>
    </div>
  );
};

export default InputForm; 