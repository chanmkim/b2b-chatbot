# B2B Chat Application

## 프로젝트 소개

B2B Chat은 기업 간 커뮤니케이션을 위한 CS챗봇. Next.js 13 App Router와 Supabase를 활용하여 구축되었음

🔗 **Live Demo**: [https://b2b-chat.vercel.app/](https://b2b-chat.vercel.app/)

## 주요 기능

### 1. 실시간 채팅
- 기업 간 실시간 메시지 교환
- 읽음 상태 표시
- 이미지 및 파일 공유 기능

### 2. 사용자 관리
- 기업 계정 관리
- 사용자 프로필 설정
- 권한 기반 접근 제어

### 3. 기업 관리
- 기업 프로필 관리
- 직원 초대 및 관리
- 기업 간 연결 관리

## 기술 스택

- **Frontend**: Next.js 13 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase
- **상태 관리**: TanStack Query, Zustand
- **폼 관리**: React Hook Form, Zod
- **유틸리티**: date-fns, ts-pattern

## URL 구조

```
/ - 메인 페이지
├── /auth
│   ├── /signin - 로그인
│   └── /signup - 회원가입
├── /dashboard
│   ├── /chat - 채팅 목록
│   ├── /profile - 프로필 관리
│   └── /settings - 설정
└── /company
    ├── /[id] - 기업 상세 정보
    └── /manage - 기업 관리
```

## 개발 환경 설정

1. 저장소 클론
```bash
git clone https://github.com/[username]/b2b-chat.git
cd b2b-chat
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
cp .env.example .env.local
```

4. 개발 서버 실행
```bash
npm run dev
```

## 환경 변수 설정

프로젝트 실행을 위해 다음 환경 변수가 필요합니다:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 키
- `NEXT_PUBLIC_SITE_URL`: 사이트 URL

## 라이선스

MIT License
