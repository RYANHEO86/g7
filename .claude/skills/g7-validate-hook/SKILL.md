---
name: g7-validate-hook
description: Use after creating or editing 그누보드7 hooks or listeners — Action/Filter hooks, doAction/applyFilters calls, HookListenerInterface implementations, getSubscribedHooks. Validates hook type declaration, Repository injection in listeners, and auto-discovery requirements. Trigger when hook/listener work is finished.
---

# 그누보드7 훅 검증

이 스킬이 발동하면 **그누7 자체 검증 절차서를 따른다.**

## 절차

1. **원본 절차서를 Read 한다**: `docs/ai-tools/skills/validate-hook.md`
2. 규정 문서 Read: `docs/extension/hooks.md`, `docs/backend/service-repository.md`
3. 규정 위반을 항목별로 보고하고 고친다.

## 자주 걸리는 위반

- Listener에서 `Model::query/find/where/create`, `DB::table()`, `$row->save()/delete()` 직접 호출 (→ Repository 인터페이스의 도메인 메서드 위임)
- Listener 생성자에 구체 Repository 직접 주입 (→ Interface 주입)
- Filter 훅에 `'type' => 'filter'` 누락 (반환값 무시 회귀)
- auto-discovery 대상이 `HookListenerInterface` 미구현 / `getSubscribedHooks()` 정적 메서드 누락
