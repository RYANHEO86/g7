---
name: g7-create-module
description: Use when scaffolding or starting a new 그누보드7 module (under modules/) — a new board type, shop feature, page type, or other large self-contained feature. Generates the correct directory skeleton, module.json, routes, layouts, and Service-Repository structure following project conventions. Trigger when the user wants to create a new module.
---

# 그누보드7 모듈 스캐폴딩

이 스킬이 발동하면 **그누7 자체 절차서를 따른다.** 임의 구조로 만들지 마라.

## 절차

1. **원본 절차서를 Read 한다**: `docs/ai-tools/skills/create-module.md`
2. 규정 문서 Read: `docs/extension/module-basics.md`, `module-routing.md`, `module-layouts.md`, `module-i18n.md`, `hooks.md`
3. 기존 모듈을 참조 표본으로 본다: `modules/_bundled/sirsoft-board` (또는 sirsoft-page).
4. 절차서가 정의한 디렉토리/파일 구조대로 스캐폴딩한다.
5. 완료 후 `/g7-validate-backend`, `/g7-validate-frontend`로 검증한다.

## 핵심 포인트

- 식별자는 `vendor-module` 형식 (예: `sirsoft-ecommerce`)
- API URL prefix 자동: `/api/modules/[vendor-module]/...`
- 레이아웃: `modules/_bundled/[vendor-module]/resources/layouts/`
- 코어(`app/`) 수정 없이 모듈 안에서 완결
