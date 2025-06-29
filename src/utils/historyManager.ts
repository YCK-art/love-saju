import { PersonInfo, SajuResult } from '../App';
import { CompatibilityAnalysis } from './sajuCalculator';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  userInfo: PersonInfo;
  crushInfo: PersonInfo;
  result: SajuResult;
  analysis: CompatibilityAnalysis;
}

export class HistoryManager {
  private static readonly STORAGE_KEY = 'saju_history';

  // 히스토리 저장
  static saveToHistory(userInfo: PersonInfo, crushInfo: PersonInfo, result: SajuResult, analysis: CompatibilityAnalysis): void {
    const history = this.getHistory();
    
    const newEntry: HistoryEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      userInfo,
      crushInfo,
      result,
      analysis
    };

    history.unshift(newEntry); // 최신 항목을 맨 앞에 추가
    
    // 최대 20개까지만 저장
    if (history.length > 20) {
      history.splice(20);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }

  // 히스토리 가져오기
  static getHistory(): HistoryEntry[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('히스토리 로드 중 오류:', error);
      return [];
    }
  }

  // 특정 히스토리 항목 가져오기
  static getEntryById(id: string): HistoryEntry | null {
    const history = this.getHistory();
    return history.find(entry => entry.id === id) || null;
  }

  // 히스토리 항목 삭제
  static removeEntry(id: string): void {
    const history = this.getHistory();
    const filteredHistory = history.filter(entry => entry.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredHistory));
  }

  // 전체 히스토리 삭제
  static clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // 히스토리 항목 수 가져오기
  static getHistoryCount(): number {
    return this.getHistory().length;
  }

  // 고유 ID 생성
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 날짜 포맷팅
  static formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return '방금 전';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}시간 전`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }

  // 공유 링크 생성
  static generateShareLink(entry: HistoryEntry): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/share/${entry.id}`;
  }

  // 공유 링크에서 ID 추출
  static extractIdFromShareLink(url: string): string | null {
    const match = url.match(/\/share\/([a-zA-Z0-9]+)$/);
    return match ? match[1] : null;
  }
} 