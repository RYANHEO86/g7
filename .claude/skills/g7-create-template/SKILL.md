---
name: g7-create-template
description: Use when creating a new 그누보드7 user or admin template (theme) — a new visual design/layout set under templates/, e.g. a custom "offset" theme. Scaffolds template.json, routes.json, base layout (slot system), error layouts, and component structure following project conventions. Trigger when the user wants to build a new theme/template rather than editing the bundled sirsoft-basic. Note: scaffolding produces a minimal skeleton; if the user wants to keep an existing design, also compare against cloning sirsoft-basic.
---

# 그누보드7 템플릿(테마) 스캐폴딩

이 스킬이 발동하면 **그누7 자체 절차서를 따른다.** 새 테마는 기본 템플릿/코어를 직접 수정하지 말고 별도 템플릿으로 만든다(역할분리 원칙).

## 절차

1. **원본 절차서를 Read 한다**: `docs/ai-tools/skills/create-template.md`
2. 규정 문서 Read: `docs/frontend/template-development.md`, `docs/extension/template-workflow.md`
3. 참조 샘플 확인: `templates/_bundled/gnuboard7-hello_user_template/` (User) / `gnuboard7-hello_admin_template/` (Admin)
4. 사용자 목적을 먼저 확인한다:
   - **최소 골격부터** 원하면 → `/create-template vendor-template --type=user` 스캐폴딩 (docs 정석)
   - **기존 디자인(sirsoft-basic) 베이스로 수정**이 목적이면 → sirsoft-basic 복제도 비교 제시 (단, docs 공식 절차는 아님을 명시)
5. 생성 후 단계: `npm install` → `template:build` → `template:install` → `template:activate`
6. 완료 후 `/g7-validate-frontend`로 검증.

## 핵심 포인트

- 식별자: User는 `vendor-xxx`, Admin은 `vendor-admin_xxx`
- 위치: `templates/_bundled/vendor-template/`
- 타입별 활성 템플릿은 1개 — 활성화 시 기존 활성 모듈/플러그인 레이아웃이 새 템플릿에 자동 등록됨
- 활성 템플릿에 없는 라우트 레이아웃은 코어 기본으로 fallback 되므로, 필요한 레이아웃(auth/login 등)을 빠짐없이 만들어라
