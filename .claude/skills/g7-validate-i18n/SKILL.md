---
name: g7-validate-i18n
description: Use after adding or editing 그누보드7 multilingual/translation content — lang/{locale}/*.php, frontend i18n keys ($t:), translatable DB columns, or language packs. Validates key structure, locale coverage (ko/en 등), and sub-key preservation. Trigger when i18n/translation work is finished.
---

# 그누보드7 다국어 검증

이 스킬이 발동하면 **그누7 자체 검증 절차서를 따른다.**

## 절차

1. **원본 절차서를 Read 한다**: `docs/ai-tools/skills/validate-i18n.md`
2. 규정 문서 Read: `docs/extension/module-i18n.md`, `docs/frontend/data-binding-i18n.md`
3. 모든 활성 로케일에 키가 빠짐없이 존재하는지, 키 네이밍이 규정과 일치하는지 검증하고 고친다.

## 핵심 포인트

- 프론트 라벨은 `$t:` 접두사 사용, 하드코딩 문자열 금지
- 백엔드 메시지는 `__()` 사용
- 운영자 수정 라벨은 sub-key 단위 보존 (언어팩이 덮어쓰지 않도록)
- 하드코딩 문자열을 키로 빼내야 하면 `/g7-extract-i18n-keys`를 사용
