import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import Loading from './components/Loading';
import Result from './components/Result';
import HistorySidebar from './components/HistorySidebar';
import StartScreen from './components/StartScreen';
import Header from './components/Header';
import { calculateSaju, analyzeCompatibility, CompatibilityAnalysis } from './utils/sajuCalculator';
import { HistoryManager, HistoryEntry } from './utils/historyManager';
import { AuthUser, onAuthStateChange } from './utils/authManager';

export interface PersonInfo {
  name: string;
  gender: '남자' | '여자';
  birthDate: string;
  birthTime: string;
}

export interface SajuResult {
  title: string;
  description: string;
  compatibility: number;
}

function App() {
  const [showStart, setShowStart] = useState(true); // 첫 화면 제어
  const [currentStep, setCurrentStep] = useState<'input' | 'loading' | 'result'>('input');
  const [userInfo, setUserInfo] = useState<PersonInfo | null>(null);
  const [crushInfo, setCrushInfo] = useState<PersonInfo | null>(null);
  const [result, setResult] = useState<SajuResult | null>(null);
  const [analysis, setAnalysis] = useState<CompatibilityAnalysis | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [historyKey, setHistoryKey] = useState(0); // 히스토리 강제 리렌더링용
  const [authUser, setAuthUser] = useState<AuthUser | null>(null); // 인증된 사용자

  // 인증 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setAuthUser(user);
    });
    return unsubscribe;
  }, []);

  // 로그아웃 시 입력화면으로 이동
  useEffect(() => {
    if (!authUser) {
      setCurrentStep('input');
      setUserInfo(null);
      setCrushInfo(null);
      setResult(null);
      setAnalysis(null);
    }
  }, [authUser]);

  // 모바일 감지
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 700;
      setIsMobile(mobile);
      // PC에서는 항상 열려있도록
      if (!mobile) {
        setIsHistoryOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const shown = localStorage.getItem('introShown');
    if (shown) setShowStart(false);
  }, []);

  const handleCloseIntro = () => {
    setShowStart(false);
    localStorage.setItem('introShown', 'true');
  };

  const handleStartReading = (user: PersonInfo, crush: PersonInfo) => {
    setUserInfo(user);
    setCrushInfo(crush);
    setCurrentStep('loading');

    // 2-3초 후 결과 페이지로 이동
    setTimeout(() => {
      // 실제 사주 계산
      const userSaju = calculateSaju(user.birthDate, user.birthTime);
      const crushSaju = calculateSaju(crush.birthDate, crush.birthTime);
      const compatibilityAnalysis = analyzeCompatibility(userSaju, crushSaju);

      const newResult: SajuResult = {
        title: `${user.name}님과 ${crush.name}님은 운명의 짝일까요?`,
        description: compatibilityAnalysis.detailedAnalysis,
        compatibility: compatibilityAnalysis.overallScore
      };

      setResult(newResult);
      setAnalysis(compatibilityAnalysis);
      setCurrentStep('result');

      // 히스토리에 저장 (uid)
      HistoryManager.saveToHistory(user, crush, newResult, compatibilityAnalysis, authUser?.uid);
      
      // 히스토리 사이드바 강제 새로고침
      setHistoryKey(prev => prev + 1);
    }, 2500);
  };

  const handleRestart = () => {
    setCurrentStep('input');
    setUserInfo(null);
    setCrushInfo(null);
    setResult(null);
    setAnalysis(null);
  };

  const handleLoadHistory = (entry: HistoryEntry) => {
    setUserInfo(entry.userInfo);
    setCrushInfo(entry.crushInfo);
    setResult(entry.result);
    setAnalysis(entry.analysis);
    setCurrentStep('result');
    if (isMobile) {
      setIsHistoryOpen(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #ffe5f1 0%, #f3e5f5 50%, #e9d5ff 100%)',
      fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header (로그인/회원가입 버튼) */}
      <Header user={authUser} onUserChange={setAuthUser} />

      {/* 인트로 화면 */}
      {showStart && <StartScreen onStart={handleCloseIntro} />}

      {/* 히스토리 사이드바 */}
      <HistorySidebar
        key={historyKey} // 강제 리렌더링을 위한 key
        isOpen={isHistoryOpen}
        onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
        onLoadHistory={handleLoadHistory}
        uid={authUser?.uid}
      />

      {/* 메인 콘텐츠 */}
      <div style={{
        marginLeft: isMobile ? 0 : '320px',
        padding: '2rem 1rem',
        paddingTop: '5rem', // Header 높이만큼 여백 추가
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: showStart ? 0.4 : 1,
        pointerEvents: showStart ? 'none' : 'auto',
        transition: 'opacity 0.4s',
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '500px',
          background: 'rgba(255,255,255,0.8)',
          borderRadius: '2rem',
          boxShadow: '0 8px 32px rgba(236,72,153,0.1)',
          backdropFilter: 'blur(10px)',
          padding: '2rem 1.5rem',
        }}>
          {currentStep === 'input' && (
            <InputForm onStartReading={handleStartReading} />
          )}
          {currentStep === 'loading' && (
            <Loading />
          )}
          {currentStep === 'result' && result && analysis && userInfo && crushInfo && (
            <Result 
              result={result} 
              userInfo={userInfo} 
              crushInfo={crushInfo}
              analysis={analysis}
              onRestart={handleRestart} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
