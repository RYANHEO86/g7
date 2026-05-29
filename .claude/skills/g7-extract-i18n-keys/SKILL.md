---
name: g7-extract-i18n-keys
description: Use when extracting hardcoded user-facing strings into i18n keys in 그누보드7 — converting literal text in layouts, components, or backend code into $t: / __() keys with proper lang file entries. Trigger when the user wants to internationalize hardcoded strings.
---

# 그누보드7 다국어 키 추출

이 스킬이 발동하면 **그누7 자체 절차서를 따른다.**

## 절차

1. **원본 절차서를 Read 한다**: `docs/ai-tools/skills/extract-i18n-keys.md`
2. 규정 문서 Read: `docs/extension/module-i18n.md`, `docs/frontend/data-binding-i18n.md`
3. 하드코딩 문자열을 찾아 키로 치환하고, 모든 활성 로케일 lang 파일에 항목을 추가한다.
4. 완료 후 `/g7-validate-i18n`으로 검증한다.

## 핵심 포인트

- 프론트: 문자열 → `$t:domain.key`
- 백엔드: 문자열 → `__('domain.key')`
- 키 네이밍은 도메인 기준, 모든 로케일에 동시 추가
