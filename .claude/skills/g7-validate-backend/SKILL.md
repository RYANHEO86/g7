---
name: g7-validate-backend
description: Use after creating or editing any 그누보드7 backend artifact — controllers, services, repositories, FormRequests, API resources, models, enums, DTOs, or migrations. Validates the Service-Repository pattern, validation placement (FormRequest only), ResponseHelper usage, route naming, and i18n of exception messages. Trigger proactively when backend work is finished, before declaring it done.
---

# 그누보드7 백엔드 검증

이 스킬이 발동하면 **그누7 자체 검증 절차서를 따른다.** 일반 Laravel 상식으로 판단하지 마라.

## 절차

1. **원본 절차서를 Read 한다**: `docs/ai-tools/skills/validate-backend.md`
2. 그 절차서가 지시하는 **규정 문서들을 Read 한다** (최소):
   - `docs/backend/service-repository.md`, `controllers.md`, `routing.md`
   - `docs/backend/validation.md`, `response-helper.md`, `api-resources.md`
   - `docs/backend/exceptions.md`, `enum.md`, `dto.md`
3. 규정 위반을 항목별로 보고하고, 위반이 있으면 고친다.

## 자주 걸리는 위반 (전체는 `AGENTS.md` CRITICAL RULES)

- Service/Listener에서 Model 직접 조작 (→ Repository 인터페이스 주입)
- 검증 로직을 Service에 배치 (→ FormRequest)
- API 응답을 ResponseHelper 없이 직접 반환
- 라우트 `name()` 누락 / 예외 메시지 하드코딩 (→ `__()`)
- 프론트도 함께 바뀌었으면 `/g7-validate-frontend`도 같이 돌려라.
