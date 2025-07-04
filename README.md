# 💕 연애 사주풀이 앱

한국어로 된 연애 사주풀이 웹 애플리케이션입니다. 사용자와 상대방의 정보를 입력하면 사주 기반의 연애 호환성을 분석해주는 재미있는 앱입니다.

## 🚀 주요 기능

- **사용자 정보 입력**: 이름, 성별, 생년월일, 태어난 시간
- **상대방 정보 입력**: 동일한 정보 입력 폼
- **로딩 화면**: 사주 분석 중임을 보여주는 애니메이션
- **결과 페이지**: 호환성 점수와 상세한 사주 해석
- **반응형 디자인**: 모바일 중심의 UI

## 🛠️ 기술 스택

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Noto Sans KR** 폰트 (한국어 최적화)

## 📱 화면 구성

### 1. 입력 폼
- 사용자와 상대방의 개인정보 입력
- 직관적인 UI로 쉬운 데이터 입력
- 필수 항목 검증

### 2. 로딩 화면
- 사주 분석 중임을 나타내는 애니메이션
- 점진적인 로딩 메시지 표시
- 2-3초의 인위적 딜레이

### 3. 결과 페이지
- 호환성 점수 (60-100점)
- 상세한 사주 해석 텍스트
- 두 사람의 정보 요약
- 조언 섹션

## 🎨 디자인 특징

- **파스텔톤 색상**: 핑크, 라벤더, 연보라 그라데이션
- **카드 형태 UI**: 깔끔하고 모던한 디자인
- **부드러운 애니메이션**: 사용자 경험 향상
- **모바일 최적화**: 반응형 디자인

## 🚀 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 빌드
npm run build
```

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── InputForm.tsx    # 정보 입력 폼
│   ├── Loading.tsx      # 로딩 화면
│   └── Result.tsx       # 결과 페이지
├── App.tsx              # 메인 앱 컴포넌트
├── index.tsx            # 앱 진입점
└── index.css            # 전역 스타일
```

## 🔮 사주풀이 로직

현재는 더미 데이터를 사용하여 결과를 생성합니다:
- 호환성 점수: 60-100점 사이의 랜덤 값
- 사주 해석: 하드코딩된 텍스트
- 향후 실제 사주 계산 API 연동 예정

## 💡 향후 개선 사항

- [ ] 실제 사주 계산 알고리즘 구현
- [ ] 더 다양한 결과 텍스트 추가
- [ ] 결과 공유 기능
- [ ] 히스토리 저장 기능
- [ ] 더 정교한 호환성 분석

## 📝 라이선스

이 프로젝트는 교육 및 개인 사용 목적으로 제작되었습니다.

---

💕 **사주는 참고사항일 뿐입니다. 진정한 사랑은 서로의 마음과 노력에서 나옵니다!**
