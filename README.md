# PromptWiki Web

AI 활용 가이드 위키 — Astro SSG + Cloudflare Pages

## 개발 환경

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

## 구조

```
src/
├── content/docs/   # content 레포 서브모듈
├── pages/
│   ├── index.astro          # /ko 리다이렉트
│   ├── [lang]/
│   │   ├── index.astro      # 문서 목록 (필터)
│   │   └── [...slug].astro  # 문서 상세
├── layouts/BaseLayout.astro
└── components/
    ├── DocCard.astro
    ├── FilterBar.astro
    └── StatusBadge.astro
```

## 배포

GitHub Actions → Cloudflare Pages 자동 배포.
`content` 레포 merge 시에도 자동 재빌드됩니다.
