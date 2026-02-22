import { defineCollection, z } from 'astro:content';

/**
 * 프로젝트 메타데이터 (project.json)
 */
const projects = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    title: z.string().min(5),
    description: z.string(),
    lang: z.enum(['ko', 'en']),
    category: z.array(z.string()).min(1),
    tags: z.array(z.string()).optional().default([]),
    status: z.enum(['in-progress', 'completed', 'archived']),
    author: z.string(),
    contributors: z.array(z.string()).optional().default([]),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

/**
 * 체크포인트 스키마 - 각 버전의 기대 결과물/검증 기준
 */
const checkpointSchema = z.object({
  // 이 단계 완료 시 기대 상태 설명
  description: z.string().optional(),
  // 충족해야 할 기준 목록 (체크리스트)
  criteria: z.array(z.string()).optional().default([]),
  // AI 검증용 프롬프트 (선택)
  validationPrompt: z.string().optional(),
}).optional();

/**
 * Git 정보 스키마 - 버전 생성 시점의 git 상태
 */
const gitSchema = z.object({
  // 짧은 커밋 해시 (7자)
  commit: z.string(),
  // 전체 커밋 해시 (40자)
  commitFull: z.string().optional(),
  // 브랜치 이름
  branch: z.string().optional(),
  // 커밋되지 않은 변경 있음
  dirty: z.boolean().optional(),
  // 태그 (있는 경우)
  tag: z.string().optional(),
}).optional();

/**
 * 프로젝트 버전 파일 (v001.md, v002.md, ...)
 */
const versions = defineCollection({
  type: 'content',
  schema: z.object({
    version: z.number().min(1),
    title: z.string(),
    summary: z.string().optional(),
    createdAt: z.string(),
    aiModel: z.string().optional(),
    changeType: z.enum(['major', 'minor', 'patch']).optional(),
    highlights: z.array(z.string()).optional().default([]),
    // 체크포인트: 이 단계의 기대 결과물 및 검증 기준
    checkpoint: checkpointSchema,
    // Git 정보: 이 버전 생성 시점의 git 상태 (증명용)
    git: gitSchema,
  }),
});

export const collections = { projects, versions };
