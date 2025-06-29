// 사주 계산 유틸리티
export interface SajuElements {
  year: string; // 년간
  month: string; // 월간
  day: string; // 일간
  hour: string; // 시간
  elements: string[]; // 오행 배열
}

export interface CompatibilityAnalysis {
  overallScore: number;
  elementHarmony: string;
  timeInfluence: string;
  personalityMatch: string;
  relationshipAdvice: string;
  detailedAnalysis: string;
}

// 천간 오행 매핑
const heavenlyStems: { [key: string]: string } = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
};

// 지지 오행 매핑
const earthlyBranches: { [key: string]: string } = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 오행 상생 관계
const elementRelations: { [key: string]: { [key: string]: string } } = {
  '木': { '火': '상생', '土': '상극', '金': '상극', '水': '상생' },
  '火': { '土': '상생', '金': '상극', '水': '상극', '木': '상생' },
  '土': { '金': '상생', '水': '상극', '木': '상극', '火': '상생' },
  '金': { '水': '상생', '木': '상극', '火': '상극', '土': '상생' },
  '水': { '木': '상생', '火': '상극', '土': '상극', '金': '상생' }
};

// 간단한 사주 계산 (실제로는 더 복잡한 계산이 필요)
export function calculateSaju(birthDate: string, birthTime: string): SajuElements {
  const date = new Date(birthDate + 'T' + (birthTime || '12:00'));
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();

  // 간단한 천간 계산 (실제로는 더 복잡한 공식 사용)
  const yearStem = getYearStem(year);
  const monthStem = getMonthStem(year, month);
  const dayStem = getDayStem(year, month, day);
  const hourStem = getHourStem(dayStem, hour);

  const elements = [
    heavenlyStems[yearStem],
    heavenlyStems[monthStem],
    heavenlyStems[dayStem],
    heavenlyStems[hourStem]
  ];

  return {
    year: yearStem,
    month: monthStem,
    day: dayStem,
    hour: hourStem,
    elements
  };
}

// 천간 계산 함수들 (간소화된 버전)
function getYearStem(year: number): string {
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  return stems[(year - 4) % 10];
}

function getMonthStem(year: number, month: number): string {
  const yearStem = getYearStem(year);
  const stemIndex = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'].indexOf(yearStem);
  const monthOffset = [2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3][month - 1];
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  return stems[(stemIndex + monthOffset) % 10];
}

function getDayStem(year: number, month: number, day: number): string {
  // 간단한 일간 계산 (실제로는 더 정확한 공식 필요)
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  return stems[daysDiff % 10];
}

function getHourStem(dayStem: string, hour: number): string {
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const dayIndex = stems.indexOf(dayStem);
  const hourOffset = Math.floor(hour / 2) % 12;
  return stems[(dayIndex * 2 + hourOffset) % 10];
}

// 호환성 분석
export function analyzeCompatibility(userSaju: SajuElements, partnerSaju: SajuElements): CompatibilityAnalysis {
  const userElements = userSaju.elements;
  const partnerElements = partnerSaju.elements;
  
  let harmonyScore = 0;
  let conflicts = 0;
  let complements = 0;

  // 오행 관계 분석
  for (let i = 0; i < userElements.length; i++) {
    const userElement = userElements[i];
    const partnerElement = partnerElements[i];
    
    if (userElement === partnerElement) {
      harmonyScore += 25; // 같은 오행
    } else if (elementRelations[userElement]?.[partnerElement] === '상생') {
      harmonyScore += 30; // 상생 관계
      complements++;
    } else if (elementRelations[userElement]?.[partnerElement] === '상극') {
      harmonyScore -= 10; // 상극 관계
      conflicts++;
    } else {
      harmonyScore += 15; // 중성 관계
    }
  }

  // 시간대 영향 분석
  const timeInfluence = analyzeTimeInfluence(userSaju, partnerSaju);
  
  // 성격 매칭 분석
  const personalityMatch = analyzePersonality(userSaju, partnerSaju);
  
  // 관계 조언 생성
  const relationshipAdvice = generateRelationshipAdvice(harmonyScore, conflicts, complements);
  
  // 상세 분석 텍스트 생성
  const detailedAnalysis = generateDetailedAnalysis(userSaju, partnerSaju, harmonyScore, conflicts, complements);

  return {
    overallScore: Math.max(60, Math.min(100, harmonyScore)),
    elementHarmony: getElementHarmonyText(harmonyScore),
    timeInfluence,
    personalityMatch,
    relationshipAdvice,
    detailedAnalysis
  };
}

function analyzeTimeInfluence(userSaju: SajuElements, partnerSaju: SajuElements): string {
  const userHourElement = heavenlyStems[userSaju.hour];
  const partnerHourElement = heavenlyStems[partnerSaju.hour];
  
  if (userHourElement === partnerHourElement) {
    return "두 사람 모두 비슷한 시간대에 태어나 일상 리듬이 잘 맞습니다.";
  } else if (elementRelations[userHourElement]?.[partnerHourElement] === '상생') {
    return "태어난 시간대의 기운이 서로 보완되어 감정적 안정감을 제공합니다.";
  } else if (elementRelations[userHourElement]?.[partnerHourElement] === '상극') {
    return "시간대 기운의 차이로 인해 갈등이 있을 수 있지만, 소통을 통해 극복할 수 있습니다.";
  }
  return "시간대 기운이 중성적이어서 특별한 충돌이나 조화는 없습니다.";
}

function analyzePersonality(userSaju: SajuElements, partnerSaju: SajuElements): string {
  const userDayElement = heavenlyStems[userSaju.day];
  const partnerDayElement = heavenlyStems[partnerSaju.day];
  
  const elementPersonalities: { [key: string]: string } = {
    '木': '성장과 발전을 추구하는 진취적인 성격',
    '火': '열정적이고 활발한 리더십 성격',
    '土': '안정적이고 신뢰할 수 있는 중재자 성격',
    '金': '정의롭고 원칙적인 판단력 성격',
    '水': '지혜롭고 적응력이 뛰어난 지적 성격'
  };

  const userPersonality = elementPersonalities[userDayElement];
  const partnerPersonality = elementPersonalities[partnerDayElement];
  
  if (userDayElement === partnerDayElement) {
    return `두 사람 모두 ${userPersonality}으로 비슷한 가치관을 가지고 있어 이해하기 쉽습니다.`;
  } else if (elementRelations[userDayElement]?.[partnerDayElement] === '상생') {
    return `${userPersonality}과 ${partnerPersonality}이 서로를 보완하는 완벽한 조합입니다.`;
  } else {
    return `${userPersonality}과 ${partnerPersonality}의 차이로 인해 서로를 배우고 성장할 수 있는 관계입니다.`;
  }
}

function generateRelationshipAdvice(harmonyScore: number, conflicts: number, complements: number): string {
  if (harmonyScore >= 85) {
    return "완벽한 궁합입니다. 서로를 믿고 사랑하며 행복한 관계를 만들어가세요.";
  } else if (harmonyScore >= 70) {
    return "좋은 궁합입니다. 소통을 통해 더욱 깊은 관계를 발전시킬 수 있습니다.";
  } else if (complements > conflicts) {
    return "보완적인 관계입니다. 서로의 차이를 이해하고 존중하는 것이 중요합니다.";
  } else {
    return "도전적인 관계입니다. 인내심과 소통을 통해 서로를 이해하는 노력이 필요합니다.";
  }
}

function generateDetailedAnalysis(userSaju: SajuElements, partnerSaju: SajuElements, harmonyScore: number, conflicts: number, complements: number): string {
  const userDayElement = heavenlyStems[userSaju.day];
  const partnerDayElement = heavenlyStems[partnerSaju.day];
  const userHourElement = heavenlyStems[userSaju.hour];
  const partnerHourElement = heavenlyStems[partnerSaju.hour];

  let analysis = `${userSaju.day}간(日干)의 ${userDayElement} 기운과 ${partnerSaju.day}간의 ${partnerDayElement} 기운을 분석해보면, `;

  if (userDayElement === partnerDayElement) {
    analysis += `두 사람 모두 ${userDayElement}의 기운이 강해 비슷한 성향을 가지고 있습니다. `;
    analysis += "이는 서로를 쉽게 이해할 수 있다는 장점이 있지만, 때로는 지나치게 비슷해서 새로운 자극이 부족할 수 있습니다. ";
  } else if (elementRelations[userDayElement]?.[partnerDayElement] === '상생') {
    analysis += `${userDayElement}과 ${partnerDayElement}의 상생 관계로 서로에게 긍정적인 영향을 주고받는 조화로운 관계입니다. `;
    analysis += "특히 서로의 부족한 부분을 자연스럽게 보완해주어 안정적인 유대를 형성할 수 있습니다. ";
  } else if (elementRelations[userDayElement]?.[partnerDayElement] === '상극') {
    analysis += `${userDayElement}과 ${partnerDayElement}의 상극 관계로 인해 초기에는 갈등이 있을 수 있습니다. `;
    analysis += "하지만 이러한 차이를 통해 서로를 더 깊이 이해하고 성장할 수 있는 기회가 됩니다. ";
  } else {
    analysis += `${userDayElement}과 ${partnerDayElement}의 중성적 관계로 특별한 충돌이나 조화는 없습니다. `;
    analysis += "서로의 노력과 소통을 통해 관계를 발전시킬 수 있는 잠재력을 가지고 있습니다. ";
  }

  // 시간대 영향 추가
  if (userHourElement !== partnerHourElement) {
    analysis += `또한 태어난 시간대의 ${userHourElement} 기운과 ${partnerHourElement} 기운의 차이로 인해, `;
    if (elementRelations[userHourElement]?.[partnerHourElement] === '상생') {
      analysis += "일상적인 리듬과 감정 표현 방식이 서로를 보완해주는 역할을 합니다. ";
    } else {
      analysis += "일상 생활에서 서로 다른 패턴을 보일 수 있으니 이해와 배려가 중요합니다. ";
    }
  }

  // 최종 조언
  if (harmonyScore >= 80) {
    analysis += "전반적으로 매우 좋은 궁합으로, 서로를 믿고 사랑하며 행복한 관계를 만들어갈 수 있을 것입니다.";
  } else if (harmonyScore >= 65) {
    analysis += "좋은 궁합이지만, 소통과 이해를 통해 더욱 깊은 관계로 발전시킬 수 있습니다.";
  } else {
    analysis += "도전적인 관계이지만, 서로의 차이를 인정하고 배려하는 마음으로 함께 성장해나갈 수 있습니다.";
  }

  return analysis;
}

function getElementHarmonyText(harmonyScore: number): string {
  if (harmonyScore >= 85) return "완벽한 조화";
  if (harmonyScore >= 70) return "좋은 조화";
  if (harmonyScore >= 60) return "보완적 조화";
  return "도전적 조화";
} 