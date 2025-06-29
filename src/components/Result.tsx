import React from 'react';
import { SajuResult, PersonInfo } from '../App';
import { CompatibilityAnalysis } from '../utils/sajuCalculator';

interface ResultProps {
  result: SajuResult;
  userInfo: PersonInfo;
  crushInfo: PersonInfo;
  analysis: CompatibilityAnalysis;
  onRestart: () => void;
}

const Result: React.FC<ResultProps> = ({ result, userInfo, crushInfo, analysis, onRestart }) => {
  // 점수에 따라 컬러 결정
  const getScoreColor = (score: number) => {
    if (score >= 85) return '#ec4899'; // 진한 핑크
    if (score >= 70) return '#a78bfa'; // 연보라
    return '#fbbf24'; // 노랑
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 상단 카드 */}
      <div style={{
        background: 'linear-gradient(135deg, #ffe5f1 0%, #f3e5f5 100%)',
        borderRadius: '2rem',
        boxShadow: '0 8px 32px rgba(236,72,153,0.08)',
        padding: '2.5rem 1.5rem 2rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        marginBottom: '1.5rem',
      }}>
        <div style={{ position: 'absolute', top: 24, left: 24, fontSize: '2rem' }}>🔮</div>
        <div style={{ fontSize: '1.25rem', color: '#ec4899', fontWeight: 700, marginBottom: '0.5rem' }}>
          {userInfo.name} ♥ {crushInfo.name}
        </div>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1f2937', marginBottom: '0.5rem' }}>
          {result.title}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', margin: '1.5rem 0' }}>
          <div style={{
            background: getScoreColor(result.compatibility),
            color: 'white',
            borderRadius: '50%',
            width: '5rem',
            height: '5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 700,
            boxShadow: '0 4px 16px rgba(236,72,153,0.12)'
          }}>
            {result.compatibility}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', color: getScoreColor(result.compatibility) }}>
              {analysis.elementHarmony}
            </div>
            <div style={{ fontSize: '0.95rem', color: '#6b7280', marginTop: '0.2rem' }}>
              오행 조화
            </div>
          </div>
        </div>
        <div style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '0.5rem' }}>
          {analysis.personalityMatch}
        </div>
        <div style={{ fontSize: '0.95rem', color: '#a78bfa', fontWeight: 500, marginBottom: '0.5rem' }}>
          {analysis.timeInfluence}
        </div>
      </div>

      {/* 상세 해석 카드 */}
      <div style={{
        background: 'linear-gradient(135deg, #faf5ff 0%, #fff0f3 100%)',
        borderRadius: '1.5rem',
        boxShadow: '0 4px 16px rgba(167,139,250,0.08)',
        padding: '2rem 1.5rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ fontWeight: 700, color: '#8b5cf6', marginBottom: '0.75rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.3rem' }}>📖</span> 상세 사주 해석
        </div>
        <div style={{ color: '#444', fontSize: '1rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
          {analysis.detailedAnalysis}
        </div>
      </div>

      {/* 관계 조언 카드 */}
      <div style={{
        background: 'linear-gradient(90deg, #fff0f3 0%, #f3e8ff 100%)',
        borderRadius: '1.5rem',
        boxShadow: '0 2px 8px rgba(236,72,153,0.06)',
        padding: '1.5rem 1.2rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <span style={{ fontSize: '1.5rem', color: '#fbbf24' }}>💡</span>
        <div style={{ color: '#a16207', fontWeight: 500, fontSize: '1rem' }}>{analysis.relationshipAdvice}</div>
      </div>

      {/* 다시 시작하기 버튼 */}
      <button onClick={onRestart} className="btn btn-secondary">
        🔄 다시 해보기
      </button>

      {/* 하단 안내 */}
      <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#bdbdbd', marginTop: '1.5rem' }}>
        <p>이 결과는 재미로만 참고하세요</p>
        <p>실제 연애는 마음과 노력이 중요합니다 💕</p>
      </div>
    </div>
  );
};

export default Result; 