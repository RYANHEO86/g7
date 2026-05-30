# CLAUDE.md — 그누보드7 작업 헌법

> 이 파일은 매 세션 자동 로드됩니다. **여기 있는 규칙은 협상 불가입니다.**
> 그누보드7은 Laravel 12 + React 19 기반의 **신규 프로젝트**라, 너(Claude)의 사전학습 지식이 거의 없거나 틀립니다.
> 일반적인 Laravel/React 상식으로 추측하면 **반드시 틀립니다.** 항상 이 프로젝트의 docs를 근거로 삼아라.

---

## ⛔ THE IRON LAW (최우선 철칙)

```
추측으로 코드를 쓰지 마라. 작업 전에 반드시 관련 docs를 먼저 Read 하라.
docs에 없는 문법/핸들러/props는 "존재하지 않는 것"으로 간주하고 절대 쓰지 마라.
```

이 철칙을 어기는 것은 사소한 실수가 아니라 **작업 실패**다. "아마 이럴 것이다"가 떠오르면 그게 바로 docs를 열어야 한다는 신호다.

### 추측 방지 3원칙 (실제로 이걸 어겨서 헤맨 사례가 있다)

1. **추측과 근거를 구분해서 말하라.** 어떤 방법·사실을 단정하기 전에, 그게 *docs에서 직접 확인한 것*인지 *내 추론*인지 스스로 구분하라. 추론이면 "이건 추론이고 확인이 필요하다"라고 밝히고 확인하라. (예: "복제가 정석"이라고 단정했다가 틀렸던 사례 — 실제 정석은 `create-template` 스캐폴딩이었다.)
2. **"없다"고 단정하기 전에 1차 출처를 전수 확인하라.** 어떤 기능/명령/스킬/파일이 없다고 말하기 전에 — 실제 디렉토리(`ls`), `php artisan list`, `docs/ai-tools/skills/`, `docs/README.md`를 직접 확인하라. **요약/README의 목록은 오래됐을 수 있다.** (예: README엔 스킬 8개로 적혀 있었지만 실제 폴더엔 10개였다.)
3. **목록·개수는 요약이 아니라 실제 디렉토리에서 세라.** 그누7 스킬 전체는 `docs/ai-tools/skills/`를, 모듈/플러그인/템플릿은 각 디렉토리를 직접 `ls`로 확인하라.

---

## 🐞 디버깅 철칙 (버그·에러를 만났을 때)

> IRON LAW의 짝이다. 코드를 쓸 때 추측을 금지하듯, **버그를 쫓을 때도 추측으로 원인을 단정하지 마라.** 순서는 항상 **관찰 → 갈라치기 → 그 다음 추론**이다.
> (실패 사례: "해당 권한이 없습니다" 토스트 하나에 50분 — 메시지를 믿고 권한 시스템을 깊게 팠으나, 실제 원인은 전용 라우트에서 `route.slug`가 비어 폼이 `/boards//posts`로 POST한 것이었다. 빈 요청 1번(403/422 판정)이면 2분에 끝날 일이었다.)
> (실패 사례 2: 메인 알림장 변경이 화면에 안 보임 — 여러 번 헤맴. 코드(props명·optional chaining·React fiber)를 의심했으나 첫 구현은 옳았다. 진짜 원인은 **캐시 버스팅**(레이아웃은 `?v={ext.cache_version}`로 브라우저 HTTP 캐시 무효화)이었고, 결정적으로 내가 "반영하려고" 매번 실행한 **`Cache::flush()`가 그 버전 키(`g7:core:ext.cache_version`)를 0으로 리셋** → `?v=0` 고정 → 브라우저 캐시(max-age 1h)가 옛 화면을 영구 박제했다. 모순("data_source엔 N개인데 화면 0개")이 떴을 때 코드 대신 `config.json`의 cache_version을 봤어야 했다.)

1. **에러 메시지를 믿지 말고 출처를 특정하라.** "권한이 없습니다" 같은 문자열은 여러 경로에서 똑같이 나온다. 메시지는 *"어디서 멈췄나"*지 *"왜 멈췄나"*가 아니다. 먼저 `grep`으로 그 메시지를 뱉는 코드 줄을 찾아라.
2. **정적 추론(코드·DB 읽기) 전에 런타임 관찰 1개를 먼저 하라.** 실패하는 요청의 실제 URL·payload·응답코드(Network), 콘솔, DevTools 상태. 화면/요청이 *실제로* 뭘 하는지가 코드 추론 10번보다 빠르다.
3. **이분법 실험으로 영역을 갈라쳐라.** 예: "권한 문제인가 입력 문제인가?" → 빈/최소 요청을 직접 보내 403(권한 차단)인지 422(검증 도달 = 권한 통과)인지 한 번에 판정. 갈래를 좁히고 나서 그 안만 파라.
4. **모순이 나오면 가설(프레임)을 버려라.** "데이터는 완벽한데 실패한다", "A는 되는데 동일해야 할 B는 안 된다"는 → *지금 보는 영역이 원인이 아니다*라는 신호다. 같은 가설로 15분 이상 헤매면 멈추고, 가정을 글로 적고 의심하라.
5. 그누7 런타임/바인딩 버그는 추측 말고 **DevTools MCP**(`g7-state`/`g7-diagnose`/`g7-expressions`/`g7-form`/`g7-actions`)로 실제 상태부터 확인하라.
6. **레이아웃/컴포넌트 수정이 화면에 안 보이면, 코드가 아니라 캐시를 의심하라.** 캐시는 두 층이다: ① **브라우저 HTTP 캐시**(serve의 `max-age 1h`) — `?v={ext.cache_version}`로 무효화하며 `activate`가 그 timestamp를 올린다(`docs/extension/template-caching.md` Cache Busting). ② **서버 병합 캐시**(`getLayout`/`loadAndMergeLayout`) — 헤더·공통 partial 등 **레이아웃 구조**를 바꾸면 박제되고 `template:cache-clear`로도 안 풀린다. **정석: `template:build → install --force → activate`.** 그래도(특히 공통 partial 변경 시) 안 바뀌면 **`Cache::flush()`로 병합 캐시까지 비우되, Cache::flush는 `g7:core:ext.cache_version`을 0으로 날리므로 직후 반드시 `activate`(또는 tinker `app(CacheInterface::class)->put('ext.cache_version', time())`)로 복구**하라 — 복구를 빠뜨린 Cache::flush가 `?v=0` 고정의 원인이었다. 화면이 안 바뀌면 코드 말고 ⓐ`curl .../api/templates/{id}/config.json`의 `cache_version` ⓑ서버 응답(`/api/layouts/{id}/{name}.json?v=…`)을 직접 파싱(유니코드 이스케이프 주의)해 확인하고, 검증 브라우저는 1개로 고정하라.

---

## 🧭 작업 시작 프로토콜 (모든 작업에 예외 없이 적용)

아무리 사소한 작업(오타 수정 제외)이라도 이 순서를 지켜라:

1. **작업 유형 판별** — 레이아웃? 컨트롤러? 모듈? 마이그레이션? 다국어?
2. **아래 "작업유형 → 필수 문서 지도"에서 해당 docs를 찾는다**
3. **그 docs를 `Read` 한다** (목록만 보지 말고 실제로 읽어라)
4. **불확실하면 기존 유사 코드를 먼저 본다** (`templates/_bundled/sirsoft-basic`, `modules/_bundled/sirsoft-board` 등)
5. 그 다음에 비로소 구현한다
6. 작업 후 **검증 스킬**을 돌린다 (`/validate-frontend`, `/validate-backend`)

---

## 🗺️ 작업유형 → 필수 문서 지도

> 전체 인덱스는 `docs/README.md`(작업유형별) 와 `AGENTS.md`(빠른 참조 + 절대규칙)에 있다.
> **이 지도에 없는 작업이면 먼저 `docs/README.md`를 Read 해서 해당 문서를 찾아라.**

| 작업 | 먼저 읽을 문서 |
|------|---------------|
| **레이아웃 JSON (화면/테마)** | `docs/frontend/layout-json.md` → `layout-json-inheritance.md`(extends/slot) → `components.md` → `component-props.md` → `data-binding.md` → `actions.md` |
| **컴포넌트(React)** | `docs/frontend/components.md` → `components-types.md` → `components-patterns.md` |
| **상태/폼** | `docs/frontend/state-management.md` → `state-management-forms.md` |
| **액션/핸들러** | `docs/frontend/actions.md` → `actions-handlers.md` |
| **컨트롤러** | `docs/backend/controllers.md` → `routing.md` → `validation.md` → `response-helper.md` |
| **Service/Repository** | `docs/backend/service-repository.md` → `extension/hooks.md` |
| **마이그레이션/DB** | `docs/database-guide.md` |
| **모듈 개발** | `docs/extension/module-basics.md` → `module-routing.md` → `module-layouts.md` → `module-i18n.md` → `hooks.md` |
| **권한/메뉴** | `docs/extension/permissions.md` → `menus.md` |
| **다국어** | `docs/extension/module-i18n.md` → `frontend/data-binding-i18n.md` |
| **테스트** | `docs/testing-guide.md` → `frontend/layout-testing.md` |
| **템플릿 전체 개발** | `docs/frontend/template-development.md` |

---

## 🚫 절대 금지 규칙 (자주 틀리는 것 — 전체는 `AGENTS.md` "CRITICAL RULES" 참조)

- **HTML 태그 직접 사용 금지** → `Div`, `Button`, `Span` 등 컴포넌트 사용
- **조건부 렌더링은 `if` 속성만** → `type: "conditional"` 같은 건 없다
- API 호출: `G7Core.dispatch({ handler: 'apiCall' })` (❌ `G7Core.api.call`, `handler: "api"`)
- 핸들러명: `navigate`(❌nav), `toast`(❌showToast), `setState`+`target`(❌setLocalState)
- 데이터 바인딩 fallback 필수: `{{value ?? ''}}`, 배열 경로 확인 `{{x?.data?.data}}`
- Listener/Service는 **Model 직접 조작 금지** → Repository 인터페이스 주입
- 검증 로직은 **FormRequest**에 (❌ Service에 검증)
- 예외 메시지 하드코딩 금지 → `__()` 사용

> 위는 일부다. 레이아웃/백엔드 작업 전 반드시 `AGENTS.md`의 해당 섹션을 Read 하라.

---

## 🏛️ 핵심 아키텍처 사실 (반드시 기억)

- **확장 3종**: `modules/`(게시판·쇼핑몰 등 큰 기능) · `plugins/`(결제·인증 등 보조) · `templates/`(디자인). **코어(`app/`) 수정 최소화.**
- **타입별 활성 템플릿은 1개** (`TemplateManager.php`). 활성 템플릿에 특정 라우트의 레이아웃이 없으면 코어 기본으로 **fallback** 된다 → 테마가 일부 페이지에만 적용되는 증상의 원인.
- **화면 = JSON 레이아웃 + React.** 백엔드는 JSON(API)만 주고, React가 그린다.
- 레이아웃 상속: 자식 레이아웃이 `"extends": "_user_base"` + `"slots": {"content": [...]}` 로 베이스(헤더/푸터)를 상속.
- 계층: Controller → FormRequest → Service → Repository → Model.

---

## 🔒 템플릿/모듈 수정 원칙 (필수)

- **공식(`sirsoft-*`) 템플릿·모듈을 직접 수정하지 않는다.** 본사 업데이트 시 덮어써진다.
- 커스텀이 필요하면 **공식본을 복사해 내 네임스페이스(`offset-*`)로 만든 뒤 거기서만 작업**한다. 예: `sirsoft-admin_basic` → `offset-admin`
- 복사 시 **식별자 의존 부분을 모두** 내 것으로 바꾼다:
  - `template.json`의 `identifier`·`vendor`·`name`
  - `package.json`의 `name`, `components.json`의 `templateId`
  - **IIFE 전역변수명** (`vite.config.ts`의 `build.lib.name`) — PascalCase라 `sirsoft-admin_basic` 일괄 치환에서 **누락되기 쉽다.** 식별자 `offset-admin` → 전역변수 `OffsetAdmin`. 안 바꾸면 admin 화면이 "초기화 실패 / Component bundle not loaded"로 깨진다.
  - `composer.json` 네임스페이스 (모듈 등 PHP 네임스페이스가 있을 때만 — admin 템플릿엔 보통 없다)
- 복사·신규 모두 **`_bundled`에서 작업한 뒤 `install`/`activate`로 활성본에 반영**한다. **활성본(`templates/{id}`, `modules/{id}`) 직접 수정 금지** — `.gitignore` 대상이고 다음 `install --force`/`update` 때 `_bundled` 원본으로 덮어써진다.
- 작업 위치가 헷갈리면 추측하지 말고 `docs/extension/template-basics.md`, `docs/extension/module-basics.md`를 먼저 확인한다.

---

## 🧰 그누7 자체 AI 도구를 적극 활용하라

- **그누7 스킬** (`.claude/skills/`에 `g7-` 접두사로 등록, 원본은 `docs/ai-tools/skills/`). ⚠️ **전체 목록은 반드시 `docs/ai-tools/skills/`를 직접 `ls`로 확인하라** (스킬이 추가될 수 있으니 이 목록을 맹신하지 말 것). 현재 알려진 것:
  - 스캐폴딩: `/g7-create-template`(새 테마), `/g7-create-module`(모듈), `/g7-create-plugin`(플러그인)
  - 검증: `/g7-validate-frontend`, `/g7-validate-backend`, `/g7-validate-hook`, `/g7-validate-i18n`, `/g7-validate-migration`
  - 기타: `/g7-extract-i18n-keys`, `/g7-run-tests`
  - **작업 완료 선언 전에 해당 검증 스킬을 반드시 돌려라.**
- **DevTools MCP** (`g7-state`, `g7-diagnose`, `g7-expressions`, `g7-form`, `g7-actions` 등): 브라우저 런타임 상태를 조회한다. **레이아웃/상태/바인딩 버그는 추측하지 말고 이 도구로 실제 상태를 확인**하라. (`docs/ai-tools/devtools/`)

---

## ✅ 완료의 정의

- "코드 작성"은 완료가 아니다. **테스트 통과 = 완료.** (`docs/testing-guide.md`)
- 기능 구현 시 관련된 **모든 계층**(백엔드 + 프론트 + 레이아웃 렌더링) 테스트.
- 버그 수정: **실패하는 회귀 테스트 작성 → fail 확인 → 수정 → green** 4단계.
- 검증 스킬 통과 + 테스트 통과를 **실제로 실행해 확인**한 뒤에만 "완료"라고 말하라.

---

## 📚 더 깊은 규칙이 필요할 때

- `AGENTS.md` — 전체 절대규칙, 버전 동기화 의무, 테스트 프로토콜, 엔진 CHANGELOG 규칙
- `docs/README.md` — 작업유형별 문서 인덱스 (이 지도의 원본)
- `docs/{backend,frontend,extension}/` — 영역별 상세 문서

> 토큰 절약을 위해 이 파일은 **지도일 뿐**이다. 상세는 위 문서를 그때그때 Read 하라. docs를 안 읽고 한 작업은 신뢰할 수 없다.
