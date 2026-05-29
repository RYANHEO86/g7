---
name: g7-run-tests
description: Use when running or writing 그누보드7 tests — PHPUnit (backend), Vitest (frontend/components), or layout rendering tests via createLayoutTest(). Also use before declaring any feature or bugfix complete, since "tests pass = done" in this project. Trigger when tests need to be run, written, or verified.
---

# 그누보드7 테스트 실행

이 스킬이 발동하면 **그누7 자체 절차서를 따른다.** "테스트 통과 = 작업 완료" — 작성만으로는 불충분하다.

## 절차

1. **원본 절차서를 Read 한다**: `docs/ai-tools/skills/run-tests.md`
2. 규정 문서 Read: `docs/testing-guide.md`, `docs/frontend/layout-testing.md`
3. 관련된 **모든 계층**(백엔드 + 프론트 + 레이아웃 렌더링) 테스트를 실행한다.
4. 결과를 실제 출력으로 확인한다 (통과 주장 전에 반드시).

## 핵심 포인트

- 레이아웃 테스트는 E2E가 아니라 Vitest + `createLayoutTest()` (브라우저 불필요) — "인프라 부족"으로 건너뛰기 금지
- 테스트 위치: 모듈 `modules/_bundled/{id}/resources/js/__tests__/layouts/`, 템플릿 `templates/_bundled/{id}/__tests__/layouts/`
- 모듈/플러그인 프론트 테스트는 독립 `vitest.config.ts` 사용 (루트 config 포함 금지)
- 버그 수정: 실패 회귀 테스트 → fail 확인 → 수정 → green 4단계
- 릴리스 전 `composer test-smoke`
