---
version: 3
title: "기술 아키텍처 v1"
summary: "기술 스택 선택과 시스템 아키텍처 설계"
createdAt: "2026-02-10"
aiModel: "claude-opus-4"
changeType: "major"
highlights:
  - "기술 스택: Next.js + Supabase"
  - "배포: Vercel (무료 티어)"
  - "DB 스키마 초안 완성"

git:
  commit: "a1b2c3d"
  commitFull: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
  branch: "main"
  dirty: false

checkpoint:
  description: "기술 스택이 결정되고 DB 스키마 초안이 완성된 상태"
  criteria:
    - "Frontend/Backend/DB/Hosting 스택이 모두 결정됨"
    - "스택 선택 이유가 명시됨 (왜 이 기술인지)"
    - "비용 추정이 포함됨"
    - "시스템 아키텍처 다이어그램이 있음"
    - "DB 스키마가 v2 기능 목록을 지원함"
  validationPrompt: |
    위 기술 아키텍처를 검토하고 다음을 확인해주세요:
    1. 선택한 기술 스택이 MVP 요구사항에 적합한가요?
    2. 비용 추정이 현실적인가요?
    3. DB 스키마가 v2에서 정의한 모든 Must Have 기능을 지원하나요?
       - 고객 목록: customers 테이블 ✓
       - 고객 상세 + 메모: customers.notes + activities 테이블 ✓
       - 검색/필터: 인덱스 필요 여부 확인
       - 사용자 인증: users 테이블 ✓
       - 대시보드: 통계 쿼리 가능 여부
    4. 이 아키텍처로 실제 코딩을 시작할 수 있나요?
---

# 기술 아키텍처 v1

## 기술 스택 결정

### AI와의 논의

> "혼자 개발하고, 비용을 최소화하면서, 빠르게 MVP를 만들려면?"

여러 옵션을 비교한 결과:

### 선택한 스택

| 레이어 | 기술 | 이유 |
|--------|------|------|
| Frontend | **Next.js 14** | App Router, Server Components |
| Styling | **Tailwind CSS** | 빠른 개발 |
| Backend | **Supabase** | Auth + DB + Storage 올인원 |
| Database | **PostgreSQL** | Supabase 기본 제공 |
| Hosting | **Vercel** | Next.js 최적화, 무료 티어 |

### 비용 추정 (MVP)
- Vercel: $0 (Hobby)
- Supabase: $0 (Free tier, 500MB DB)
- 도메인: $12/년

**월 비용: $0** (유저 1000명까지)

## 시스템 아키텍처

```
┌─────────────┐     ┌─────────────┐
│   Vercel    │────▶│  Supabase   │
│  (Next.js)  │     │  (Postgres) │
└─────────────┘     └─────────────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│   Auth      │     │   Storage   │
│  (Supabase) │     │  (Supabase) │
└─────────────┘     └─────────────┘
```

## 데이터베이스 스키마

```sql
-- 사용자
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 고객
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 활동 기록
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  type TEXT NOT NULL, -- 'note', 'call', 'email', 'meeting'
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 다음 단계

- [ ] Supabase 프로젝트 생성
- [ ] Next.js 보일러플레이트 설정
- [ ] 인증 플로우 구현
- [ ] 고객 CRUD 구현

---

## Checkpoint: 이 단계의 기대 결과물

이 단계를 완료하면 다음이 준비되어야 합니다:

- [x] 기술 스택 결정 테이블 (각 레이어별 기술 + 선택 이유)
- [x] 월간 비용 추정
- [x] 시스템 아키텍처 다이어그램
- [x] DB 스키마 (최소 users, customers, activities 테이블)

### 기능-스키마 매핑 확인

| v2 기능 | DB 지원 여부 |
|---------|-------------|
| 고객 목록 | ✓ customers 테이블 |
| 고객 상세 + 메모 | ✓ customers + activities |
| 검색/필터 | ✓ WHERE 쿼리 (인덱스 추가 권장) |
| 사용자 인증 | ✓ Supabase Auth + users |
| 대시보드 | ✓ COUNT, 집계 쿼리 가능 |

### 다음 단계로 넘어가기 전 자가 점검

> **"이 스키마와 아키텍처로 코딩을 바로 시작할 수 있는가?"**
>
> Yes라면 실제 구현 단계로 진행하세요.
> No라면 부족한 부분을 보완하세요 (예: 인덱스, RLS 정책, API 설계 등).
