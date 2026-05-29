---
name: g7-validate-frontend
description: Use after creating or editing any 그누보드7 frontend artifact — layout JSON (files under layouts/, *.json), React components (*.tsx), action handlers, or a work plan containing frontend code blocks. Validates against the project's layout-json schema, component/props rules, handler names, and data-binding syntax. Trigger proactively whenever layout or component work is finished, before declaring it done.
---

# 그누보드7 프론트엔드 검증

이 스킬이 발동하면 **그누7 자체 검증 절차서를 따른다.** 일반 React/JSON 상식으로 판단하지 마라.

## 절차

1. **원본 절차서를 Read 한다**: `docs/ai-tools/skills/validate-frontend.md`
2. 그 절차서가 지시하는 **규정 문서들을 Read 한다** (최소):
   - `docs/frontend/layout-json.md`, `layout-json-inheritance.md`
   - `docs/frontend/components.md`, `component-props.md`
   - `docs/frontend/actions.md`, `actions-handlers.md`
   - `docs/frontend/data-binding.md`, `data-binding-i18n.md`
3. **DevTools MCP** 사용 가능하면 `g7-state`, `g7-expressions`, `g7-form`, `g7-actions`로 런타임 상태를 먼저 확인한다.
4. 검증 대상이 소스코드(*.json/*.tsx)인지 작업계획서(*.md)인지 먼저 판별한다.
5. 규정 위반을 항목별로 보고하고, 위반이 있으면 고친다.

## 자주 걸리는 위반 (전체는 `AGENTS.md` CRITICAL RULES)

- HTML 태그 직접 사용 / `type: "conditional"` 사용
- `handler: "api"`/`"nav"`/`"showToast"` (→ `apiCall`/`navigate`/`toast`)
- 바인딩 fallback 누락 `{{value}}` (→ `{{value ?? ''}}`)
- 백엔드도 함께 바뀌었으면 `/g7-validate-backend`도 같이 돌려라 (단일 영역 검증으로 완료 선언 금지).
