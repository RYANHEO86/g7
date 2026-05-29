---
name: g7-create-plugin
description: Use when scaffolding a new 그누보드7 plugin (under plugins/) — a payment integration, auth/verification, editor, marketing, or other auxiliary feature that hooks into core/modules. Generates the plugin skeleton with module.json/plugin manifest, Action/Filter hooks, and correct directory structure. Trigger when the user wants to create a new plugin.
---

# 그누보드7 플러그인 스캐폴딩

이 스킬이 발동하면 **그누7 자체 절차서를 따른다.** 코어를 수정하지 말고 플러그인으로 기능을 주입한다.

## 절차

1. **원본 절차서를 Read 한다**: `docs/ai-tools/skills/create-plugin.md`
2. 규정 문서 Read: `docs/extension/` (플러그인/훅 관련), `docs/extension/hooks.md`
3. 참조 샘플 확인: `plugins/_bundled/gnuboard7-hello_plugin/` (학습용 최소 플러그인, Action+Filter 훅)
4. `/create-plugin vendor-plugin` 으로 스캐폴딩.
5. 생성 후 단계: `extension:update-autoload` → `plugin:install` → `plugin:activate`
6. 완료 후 `/g7-validate-backend`, `/g7-validate-hook`으로 검증.

## 핵심 포인트

- 식별자: `vendor-plugin` 형식 (예: `sirsoft-payment`)
- 위치: `plugins/_bundled/vendor-plugin/`
- 코어(`app/`) 수정 없이 훅(Action/Filter)으로 기능 주입
- Listener는 Repository 인터페이스 주입, Filter 훅은 `'type' => 'filter'` 명시
