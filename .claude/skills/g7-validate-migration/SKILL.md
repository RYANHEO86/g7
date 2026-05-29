---
name: g7-validate-migration
description: Use after creating or editing 그누보드7 database migrations (database/migrations/, modules/*/database/). Validates required Korean column comments, down() implementation, naming conventions, and schema rules. Trigger when migration work is finished.
---

# 그누보드7 마이그레이션 검증

이 스킬이 발동하면 **그누7 자체 검증 절차서를 따른다.**

## 절차

1. **원본 절차서를 Read 한다**: `docs/ai-tools/skills/validate-migration.md`
2. 규정 문서 Read: `docs/database-guide.md`
3. 규정 위반을 항목별로 보고하고 고친다.

## 핵심 포인트

- 모든 컬럼에 한국어 `comment` 필수
- `down()` 메서드 구현 필수 (롤백 가능)
- 네이밍/타입 규칙은 database-guide.md 기준
- 다국어 컬럼 시딩은 TranslatableSeeder 인터페이스 사용
