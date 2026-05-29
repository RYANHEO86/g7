# 설계: 테마 카탈로그 플러그인 (`offset-theme_catalog`)

> 작성일 2026-05-29 · 상태: 합의 대기

## 1. 배경 / 목적

- **현재 상태(문제):** theme 게시판(slug=`theme`)의 카탈로그 메타(가격·라이선스·features 등)가 **공식 모듈 `sirsoft-board`를 직접 수정**해서 구현돼 있다(커밋 `72d7081`). `board_posts`에 `extra_data` 컬럼 추가 + `Post`/`PostResource`/`Store·UpdatePostRequest`/`PostRepository`/admin 폼 레이아웃까지 침범. → 본사 업데이트(beta.7+) 시 동일 경로 파일이 충돌/덮어쓰기.
- **목표:** `sirsoft-board`를 **0줄**로 되돌리고, theme 메타를 **별도 플러그인**으로 분리해 본사 업데이트와 영구 무충돌.
- **scope (사용자 확정):** theme 게시판 **전용**. 게시판 기반 메타로 유지(독립 마켓플레이스 아님) → 그래서 **모듈이 아니라 플러그인**.

## 2. 확정 사실 (코드 근거)

- `sirsoft-board`는 게시글 저장 파이프라인 hook을 표준 발행 (`PostService.php`, 본사 원본 — 내가 안 건드린 파일):
  `sirsoft-board.post.{before,after}_create` / `filter_create_data` / `{before,after}_update` / `filter_update_data` / `after_delete` / `store_validation_rules` / `update_validation_rules`.
- 게시글 **조회 응답에 외부 데이터를 병합하는 hook은 post에 없음**(user엔 `core.user.filter_resource_data` 존재, post엔 없음). → 조회는 **별도 API** 필요.
- Layout Extension: Overlay/Extension Point + `data_sources` 병합 (`LayoutExtensionService`, `core.layout_extension.before/after_apply`). 공식 레이아웃 무수정 확장 가능.
- 플러그인 능력: 마이그레이션 / 자체 API 라우트(`src/routes/api.php` — `sirsoft-marketing` 등 실증) / hook listener / layout extension **모두 가능**. 유일한 제약은 **완전한 페이지 레이아웃 등록 불가**인데, 본 작업엔 불필요(user 화면=ryan-offset, admin=확장 주입).
- `extra_data`는 본사 것이 아니라 `72d7081`에서 추가됨(beta.6 시점 Post/PostResource에 없음 — git 확인).

## 3. 메타 필드 (14개 · 현 `extra_data` 키 기준)

`price`, `license`, `description_short`, `description_long`, `features`(배열), `changelog`(텍스트), `demo_url`, `purchase_url`, `download_count`(정수), `last_update`, `install_note`, `min_requirement`, `rating`, `review_count`(정수).

## 4. 아키텍처

플러그인 `offset-theme_catalog` (디렉토리 `plugins/_bundled/offset-theme_catalog`, 네임스페이스 `Plugins\Offset\ThemeCatalog`, 의존성 `sirsoft-board`).

### 4.1 구성요소

| # | 요소 | 내용 |
|---|------|------|
| 1 | **DB 테이블** | `theme_post_metas`: `id`, `post_id`(FK unique), 위 14개 필드(`features`는 json, `changelog`/`*_note` text, `download_count`/`review_count` int), `timestamps` |
| 2 | **모델/Repository** | `ThemePostMeta` 모델 + `ThemePostMetaRepositoryInterface` 주입 (Listener/Service는 Model 직접 조작 금지) |
| 3 | **Hook Listener** (`ThemeMetaListener`, **theme slug 한정**) | `store/update_validation_rules`(filter, 메타 검증) · `post.filter_create_data/filter_update_data`(filter, 요청에서 메타 추출 후 Post 데이터에서 제거) · `post.after_create/after_update`(action, `theme_post_metas` upsert) · `post.after_delete`(action, 메타 삭제) |
| 4 | **조회 API** (`src/routes/api.php`) | 목록 `GET /api/plugins/offset-theme_catalog/theme/metas?post_ids=…`(카드 일괄) · 단건 `GET …/posts/{id}/meta`(상세). Controller→Service→Repository→Resource |
| 5 | **Layout Extension** (`resources/extensions/*.json`) | `target_layout` = admin 게시글 폼 레이아웃(정확명 구현 시 확인), Overlay `append`, **theme 게시판일 때만 `if`** 조건으로 14개 입력 필드 주입 + `data_sources`로 수정 시 기존 메타 prefill + `ExtensionBadge` 표시 |
| 6 | **다국어** | `resources/lang/ko.json`·`en.json` (필드 라벨/힌트) |

### 4.2 데이터 흐름

- **저장:** admin 폼 → `PostService.create/update` → `filter_create_data`(메타 추출, Post용 데이터에서 제거) → Post 저장 → `after_create/after_update`(메타를 `theme_post_metas`에 upsert).
- **조회(user):** ryan-offset `themes_index/show`가 `data_sources`로 플러그인 메타 API 호출 → 바인딩.
- **조회(admin 수정):** layout extension의 `data_sources`가 단건 메타 API 호출 → 폼 prefill.

## 5. 프론트 (ryan-offset = 내 템플릿, 유지+재배선)

- `themes_index.json`: 메타 `data_source` 추가, `price`/`description_short`를 `extra_data` → 메타 API 응답으로 재배선.
- `themes_show.json`: 메타 `data_source` 추가, 14개 필드 재배선.
- **이미지(썸네일/갤러리)는 본사 attachment 기반 그대로** (변경 없음).
- `ThemeListSection`/`ThemeDetailContent` 컴포넌트의 메타 입력 형태 확인 후 매핑(구현 시).

## 6. sirsoft-board 원복 (11개 파일 → 본사 무수정)

`git checkout 61f5874(beta.6) -- …` 로 복원/삭제:
`Post.php`, `PostResource.php`, `StorePostRequest.php`, `UpdatePostRequest.php`, `PostRepository.php`, `BoardServiceProvider.php`, `admin_board_post_form.json`, `_form_fields.json`, (신규 삭제) `_extra_fields_theme.json`, `MigrateThemeImagesCommand.php`, `add_extra_data_to_board_posts.php`.

## 7. 데이터 이전 (순서 중요)

1. 플러그인 설치 → `theme_post_metas` 생성.
2. 기존 theme 게시글 4개의 `extra_data` 값을 `theme_post_metas`로 이전(플러그인 시더 또는 일회성 커맨드).
3. `sirsoft-board` 원복(소스 11파일).
4. **`board_posts.extra_data` 컬럼 처리:** 데이터 이전 완료 후 일회성 drop 마이그레이션으로 제거(본사엔 원래 없던 컬럼). 소스 마이그레이션 파일만 지우면 DB 컬럼은 잔존하므로 명시적 drop 필요. — *구현 시 위치/방식 확정.*
5. 이미지 첨부는 이미 생성돼 있어 그대로 둠.

## 8. 테스트 / 검증 (완료 정의)

- 플러그인 Feature 테스트: hook 저장/조회, API 응답, **theme 한정**(다른 게시판 영향 없음).
- ryan-offset 레이아웃 회귀(`themes_index/show`).
- `sirsoft-board` 본사 테스트(원복 후 green).
- `/g7-validate-backend` · `-frontend` · `-hook` · `-migration`.
- 브라우저: `/board/theme` 목록·상세 메타 표시, admin 폼 입력→저장→반영, 이미지 정상, sirsoft-basic 요청 0 / 404 0.

## 9. 리스크 / 미확정 (구현 첫 단계 확인)

- `extra_data` 컬럼 drop 순서(데이터 이전 먼저) — 유실 위험.
- admin 게시글 폼의 **정확한 레이아웃명 + 주입 `target_id`** (Overlay 대상).
- `ThemeDetailContent`가 메타를 받는 입력 형태(객체 vs 평탄화).
- 본사 hook 인자 시그니처(`filter_create_data($data, $slug)` 등 — `PostService.php`에서 1회 재확인).
- 플러그인 메타 API의 권한(공개 조회 vs 인증) — theme는 공개 카탈로그이므로 조회는 공개로 추정, 구현 시 확정.
