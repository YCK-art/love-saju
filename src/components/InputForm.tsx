import React, { useState } from 'react';
import { PersonInfo } from '../App';

interface InputFormProps {
  onStartReading: (user: PersonInfo, crush: PersonInfo) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onStartReading }) => {
  // 2000년을 기본값으로 설정
  const defaultDate = '2000-01-01';
  
  const [userInfo, setUserInfo] = useState<PersonInfo>({
    name: '',
    gender: '남자',
    birthDate: defaultDate,
    birthTime: ''
  });

  const [crushInfo, setCrushInfo] = useState<PersonInfo>({
    name: '',
    gender: '남자',
    birthDate: defaultDate,
    birthTime: ''
  });

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

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center">
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
          💕 연애 사주풀이
        </h1>
        <p style={{ color: '#6b7280' }}>당신과 그 사람의 운명을 알아보세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 내 정보 */}
        <div className="card">
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
        <div className="card">
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
        <button type="submit" className="btn btn-primary">
          🔮 사주풀이 시작하기
        </button>
      </form>
    </div>
  );
};

export default InputForm; 