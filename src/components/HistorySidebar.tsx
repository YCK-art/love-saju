import React, { useState, useEffect } from 'react';
import { HistoryManager, HistoryEntry } from '../utils/historyManager';

interface HistorySidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onLoadHistory: (entry: HistoryEntry) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onToggle, onLoadHistory }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setHistory(HistoryManager.getHistory());
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const handleClearHistory = () => {
    HistoryManager.clearHistory();
    setHistory([]);
  };

  const handleDeleteEntry = (id: string) => {
    HistoryManager.removeEntry(id);
    setHistory(HistoryManager.getHistory());
  };

  const formatEntryTitle = (entry: HistoryEntry): string => {
    return `${entry.userInfo.name} ♥ ${entry.crushInfo.name}`;
  };

  // 사이드바 스타일
  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: isMobile ? '80vw' : '320px',
    background: 'linear-gradient(135deg, #ffe5f1 0%, #f3e5f5 100%)',
    boxShadow: '4px 0 24px rgba(236,72,153,0.08)',
    zIndex: 1100,
    transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
    transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)',
    display: 'flex',
    flexDirection: 'column',
    borderTopRightRadius: isMobile ? '2rem' : 0,
    borderBottomRightRadius: isMobile ? '2rem' : 0,
  };

  return (
    <>
      {/* 모바일 오버레이 */}
      {isMobile && isOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 99 }}
          onClick={onToggle}
        />
      )}

      {/* 사이드바 */}
      <aside style={sidebarStyle}>
        {/* 헤더 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.2rem 1.5rem 1rem 1.5rem', borderBottom: '1px solid #fce7f3',
        }}>
          <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#ec4899', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📚</span> 풀이 인벤토리
          </div>
          {isMobile && (
            <button onClick={onToggle} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#ec4899', cursor: 'pointer' }}>✕</button>
          )}
        </div>

        {/* 히스토리 목록 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem 1rem' }}>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#bdbdbd', marginTop: '3rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📝</div>
              <div>아직 풀이 기록이 없습니다</div>
              <div style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>첫 번째 사주풀이를 해보세요!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {history.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    background: 'linear-gradient(135deg, #fdf2f8 0%, #faf5ff 100%)',
                    borderRadius: '1rem',
                    boxShadow: '0 2px 8px rgba(236,72,153,0.06)',
                    padding: '1rem 1rem 0.8rem 1rem',
                    cursor: 'pointer',
                    border: '1px solid #fce7f3',
                    position: 'relative',
                  }}
                  onClick={() => onLoadHistory(entry)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 600, color: '#ec4899', fontSize: '1rem' }}>{formatEntryTitle(entry)}</div>
                    <button
                      onClick={e => { e.stopPropagation(); handleDeleteEntry(entry.id); }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '1.1rem', cursor: 'pointer' }}
                      title="삭제"
                    >
                      ×
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem', color: '#a78bfa', marginBottom: '0.3rem' }}>
                    <span>점수: <b style={{ color: '#ec4899' }}>{entry.result.compatibility}</b></span>
                    <span style={{ color: '#bdbdbd' }}>{HistoryManager.formatDate(entry.timestamp)}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#a1a1aa', marginTop: '0.2rem', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.result.title}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        {history.length > 0 && (
          <div style={{ padding: '1rem', borderTop: '1px solid #fce7f3' }}>
            <button
              onClick={handleClearHistory}
              style={{ width: '100%', background: '#f472b6', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.8rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
            >
              🗑️ 모든 기록 삭제
            </button>
          </div>
        )}
      </aside>

      {/* 모바일 토글 버튼 */}
      {isMobile && !isOpen && (
        <button
          onClick={onToggle}
          style={{
            position: 'fixed', top: '1.2rem', left: '1.2rem', zIndex: 3500,
            background: 'white', borderRadius: '50%', boxShadow: '0 4px 12px rgba(236,72,153,0.15)', border: 'none', padding: '0.9rem', cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '1.5rem', color: '#ec4899' }}>☰</span>
        </button>
      )}
    </>
  );
};

export default HistorySidebar; 