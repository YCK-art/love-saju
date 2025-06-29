# Firebase 설정 가이드

## 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: "love-saju-app")
4. Google Analytics 설정 (선택사항)
5. 프로젝트 생성 완료

## 2. 웹앱 등록

1. 프로젝트 대시보드에서 "웹" 아이콘 클릭
2. 앱 닉네임 입력 (예: "love-saju-web")
3. "Firebase Hosting 설정" 체크 해제
4. "앱 등록" 클릭

## 3. 설정 정보 복사

등록 후 제공되는 설정 정보를 복사:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 4. 코드에 설정 적용

`src/firebase.ts` 파일에서 `firebaseConfig` 객체를 실제 설정으로 교체:

```typescript
const firebaseConfig = {
  apiKey: "실제-API-키",
  authDomain: "실제-도메인",
  projectId: "실제-프로젝트-ID",
  storageBucket: "실제-스토리지-버킷",
  messagingSenderId: "실제-센더-ID",
  appId: "실제-앱-ID"
};
```

## 5. Authentication 설정

1. Firebase Console에서 "Authentication" 메뉴 클릭
2. "시작하기" 클릭
3. "로그인 방법" 탭에서 "Google" 활성화
4. 프로젝트 지원 이메일 설정
5. "저장" 클릭

## 6. Google Cloud Console 설정 (Google 로그인용)

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. Firebase 프로젝트와 동일한 프로젝트 선택
3. "API 및 서비스" > "사용자 인증 정보" 메뉴
4. "사용자 인증 정보 만들기" > "OAuth 클라이언트 ID"
5. 애플리케이션 유형: "웹 애플리케이션"
6. 승인된 리디렉션 URI에 다음 추가:
   - `http://localhost:3000`
   - `http://localhost:3000/__/auth/handler` (Firebase Auth용)

## 7. 배포 시 추가 설정

실제 도메인으로 배포할 때는 승인된 리디렉션 URI에 실제 도메인도 추가해야 합니다.

## 주의사항

- API 키는 공개되어도 안전하지만, 보안 규칙을 적절히 설정해야 합니다
- 실제 프로덕션에서는 환경변수를 사용하는 것을 권장합니다
- Firebase 무료 플랜으로도 충분히 사용 가능합니다 