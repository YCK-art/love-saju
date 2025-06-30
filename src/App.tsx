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
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Navigate
} from 'react-router-dom';
import AuthLoading from './components/AuthLoading';

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

// 공유 결과지 전용 컴포넌트
function SharedResult() {
  const { id } = useParams<{ id: string }>();
  // uid 없이 전체 히스토리에서 찾음 (비로그인 공유)
  const entry = HistoryManager.getHistory().find(e => e.id === id);
  if (!entry) return <div style={{textAlign:'center',marginTop:'4rem',color:'#bdbdbd'}}>존재하지 않는 결과지입니다.</div>;
  return (
    <Result
      result={entry.result}
      userInfo={entry.userInfo}
      crushInfo={entry.crushInfo}
      analysis={entry.analysis}
      onRestart={() => window.location.href = '/'}
      entryId={entry.id}
    />
  );
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
  const [currentResultId, setCurrentResultId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false); // 인증 상태 준비 여부

  // 인증 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setAuthUser(user);
      setIsAuthReady(true);
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

    setTimeout(() => {
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
      // 방금 저장한 히스토리의 id 추적
      const history = HistoryManager.getHistory(authUser?.uid);
      if (history && history.length > 0) {
        setCurrentResultId(history[0].id);
      } else {
        setCurrentResultId(null);
      }
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
    <Router>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #ffe5f1 0%, #f3e5f5 50%, #e9d5ff 100%)',
        fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        {!isAuthReady ? (
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>
            <AuthLoading />
          </div>
        ) : (
          <>
            <Header user={authUser} onUserChange={setAuthUser} />
            {showStart && <StartScreen onStart={handleCloseIntro} />}
            <HistorySidebar
              key={historyKey}
              isOpen={isHistoryOpen}
              onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
              onLoadHistory={handleLoadHistory}
              uid={authUser?.uid}
            />
            <main style={{ marginLeft: isMobile ? 0 : 320, transition: 'margin 0.3s', minHeight: '100vh' }}>
              <Routes>
                <Route path="/share/:id" element={<SharedResult />} />
                <Route path="/*" element={
                  <>
                    {currentStep === 'input' && <InputForm onStartReading={handleStartReading} authUser={authUser} />}
                    {currentStep === 'loading' && <Loading />}
                    {currentStep === 'result' && result && analysis && userInfo && crushInfo && (
                      <Result 
                        result={result} 
                        userInfo={userInfo} 
                        crushInfo={crushInfo}
                        analysis={analysis}
                        onRestart={handleRestart}
                        entryId={currentResultId}
                        uid={authUser?.uid}
                      />
                    )}
                  </>
                } />
              </Routes>
            </main>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
