# 테마 카탈로그 플러그인 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** theme 게시판의 카탈로그 메타(가격·라이선스·features 등 14필드)를 공식 모듈 `sirsoft-board` 수정 없이 별도 플러그인 `offset-theme_catalog`로 분리한다.

**Architecture:** 저장은 `sirsoft-board.post.*` hook(`filter_create_data`로 추출→세션→`after_create`로 별도 테이블 저장), 조회는 플러그인 자체 API(`/api/plugins/offset-theme_catalog/...`), admin 입력은 layout extension(Overlay)으로 본사 폼에 주입, user 화면은 ryan-offset 템플릿이 그 API를 `data_source`로 소비. 메타는 플러그인 소유 테이블 `theme_post_metas`에 보관.

**Tech Stack:** Laravel 12 (그누보드7 플러그인 시스템 — `AbstractPlugin`, HookManager, LayoutExtension), React 19 JSON 레이아웃(ryan-offset), PHPUnit/Pest 플러그인 테스트.

> 참고 spec: `docs/superpowers/specs/2026-05-29-theme-catalog-plugin-design.md`
> 참고 구현 패턴(읽기만): `plugins/_bundled/sirsoft-marketing/` (플러그인 골격·라우트·Repository), `modules/_bundled/sirsoft-board/src/Listeners/UserNotificationSettingsListener.php` (메타 hook listener), `modules/_bundled/sirsoft-board/resources/extensions/user-notification-settings.json` (layout extension).

---

## File Structure (생성/수정 파일 맵)

**신규 — 플러그인 `plugins/_bundled/offset-theme_catalog/`:**
- `plugin.json` — 메타데이터(identifier/vendor/name/version/g7_version/dependencies)
- `plugin.php` — `AbstractPlugin` 상속, `getHookListeners()`/`getDependencies()`/`getDynamicTables()`
- `composer.json` — psr-4 `Plugins\\Offset\\ThemeCatalog\\: ["src/", "./"]`
- `LICENSE`
- `database/migrations/2026_05_29_000001_create_theme_post_metas_table.php` — 테이블
- `database/migrations/2026_05_29_000002_drop_extra_data_from_board_posts.php` — 데이터 이전 후 컬럼 제거(Task 9)
- `src/Models/ThemePostMeta.php` — 모델
- `src/Repositories/Contracts/ThemePostMetaRepositoryInterface.php`
- `src/Repositories/ThemePostMetaRepository.php`
- `src/Services/ThemePostMetaService.php` — 저장/조회 도메인 로직
- `src/Listeners/ThemeMetaListener.php` — 저장 hook 구독
- `src/Http/Controllers/ThemeMetaController.php` — 조회 API
- `src/Http/Resources/ThemePostMetaResource.php`
- `src/routes/api.php` — 조회 라우트(자동 `/api/plugins/offset-theme_catalog/` prefix)
- `src/Providers/ThemeCatalogServiceProvider.php` — Repository 인터페이스 바인딩
- `src/Console/Commands/MigrateThemeMetaCommand.php` — extra_data→theme_post_metas 일회성 이전(Task 8)
- `resources/extensions/theme_post_form.json` — admin 게시글 폼 필드 주입
- `resources/lang/ko.json`, `resources/lang/en.json`
- `tests/Feature/ThemeMetaHookTest.php`, `tests/Feature/ThemeMetaApiTest.php`

**수정 — ryan-offset(내 템플릿):**
- `templates/_bundled/ryan-offset/layouts/board/themes_index.json` — 메타 data_source 추가, price/description_short 재배선
- `templates/_bundled/ryan-offset/layouts/board/themes_show.json` — 메타 data_source 추가, 14필드 재배선

**원복 — sirsoft-board(공식, beta.6=61f5874로 복원/삭제) — Task 9:**
- 복원: `src/Models/Post.php`, `src/Http/Resources/PostResource.php`, `src/Http/Requests/StorePostRequest.php`, `src/Http/Requests/UpdatePostRequest.php`, `src/Repositories/PostRepository.php`, `src/Providers/BoardServiceProvider.php`, `resources/layouts/admin/admin_board_post_form.json`, `resources/layouts/admin/partials/admin_board_post_form/_form_fields.json`
- 삭제: `resources/layouts/admin/partials/admin_board_post_form/_extra_fields_theme.json`, `src/Console/Commands/MigrateThemeImagesCommand.php`, `database/migrations/2026_05_18_000001_add_extra_data_to_board_posts.php`

---

## Task 0: 사전 확인 (구현 첫 단계 — 추측 금지)

**Files:** (읽기만)

- [ ] **Step 1: post hook 인자 시그니처 확정**

Run:
```bash
grep -nE "applyFilters\('sirsoft-board\.post|doAction\('sirsoft-board\.post" modules/_bundled/sirsoft-board/src/Services/PostService.php
grep -nE "post\.(store|update)_validation_rules" modules/_bundled/sirsoft-board/src -r
```
확인 대상(이미 파악된 값 — 다르면 Task 4 코드 조정):
- `filter_create_data` → 리스너 `(array $data, string $slug): array`
- `filter_update_data` → `(array $data, Post $post, string $slug): array`
- `after_create` → `(Post $post, string $slug, array $options): void`
- `after_update` → `(Post $post, string $slug, array $snapshot): void`
- `after_delete` → `(Post $post, string $slug, array $options): void`
- `store_validation_rules` / `update_validation_rules` → `(array $rules, ...): array` (정확 인자 확인)

- [ ] **Step 2: admin 게시글 폼 확장 지점(target) 확정**

Run:
```bash
grep -nE "\"id\"|extension_slot|extension_point|partial" modules/_bundled/sirsoft-board/resources/layouts/admin/admin_board_post_form.json
cat modules/_bundled/sirsoft-board/resources/extensions/user-notification-settings.json
```
목표: Overlay `target_layout`(예: `admin_board_post_form`)과 `target_id`(주입 위치 컴포넌트 id)를 확정. `user-notification-settings.json`의 `target_id`/`position` 패턴을 그대로 차용.

- [ ] **Step 3: ryan-offset 메타 소비 형태 확정**

Run:
```bash
grep -nE "extra_data|metaPost|theme.*meta" templates/_bundled/ryan-offset/layouts/board/themes_show.json templates/_bundled/ryan-offset/layouts/board/themes_index.json
grep -rn "extra_data\|features\|price" templates/_bundled/ryan-offset/src/components/composite/ThemeDetailContent.tsx templates/_bundled/ryan-offset/src/components/composite/ThemeListSection.tsx
```
목표: `ThemeDetailContent`/`ThemeListSection`이 메타를 객체로 받는지 평탄화 prop으로 받는지 확정 → Task 10 매핑 형태 결정.

- [ ] **Step 4: 확인 결과를 spec §9에 반영(메모만, 커밋 불필요)**

확정된 시그니처/target_id/소비형태를 이 계획 해당 Task에 인라인 반영. 다른 값이 나오면 그 Task의 코드를 수정.

---

## Task 1: 플러그인 스캐폴딩 + 설치/활성화

**Files:**
- Create: `plugins/_bundled/offset-theme_catalog/plugin.json`
- Create: `plugins/_bundled/offset-theme_catalog/plugin.php`
- Create: `plugins/_bundled/offset-theme_catalog/composer.json`
- Create: `plugins/_bundled/offset-theme_catalog/LICENSE`
- Create: `plugins/_bundled/offset-theme_catalog/src/Providers/ThemeCatalogServiceProvider.php`

- [ ] **Step 1: plugin.json 작성**

```json
{
  "identifier": "offset-theme_catalog",
  "vendor": "offset",
  "name": { "ko": "테마 카탈로그", "en": "Theme Catalog" },
  "version": "1.0.0",
  "license": "MIT",
  "description": { "ko": "theme 게시판 게시글에 카탈로그 메타(가격·라이선스 등)를 더합니다.", "en": "Adds catalog meta (price, license, etc.) to theme board posts." },
  "g7_version": ">=7.0.0-beta.5",
  "dependencies": { "modules": { "sirsoft-board": ">=1.0.0" }, "plugins": {} }
}
```

- [ ] **Step 2: composer.json 작성**

```json
{
  "name": "plugins/offset-theme_catalog",
  "description": "Theme catalog meta plugin for Gnuboard7 by offset",
  "type": "library",
  "require": { "php": "^8.2" },
  "autoload": { "psr-4": { "Plugins\\Offset\\ThemeCatalog\\": ["src/", "./"] } }
}
```

- [ ] **Step 3: plugin.php 작성** (라우트는 AbstractPlugin이 `src/routes/api.php` 자동 감지 — 로딩 코드 불필요)

```php
<?php

namespace Plugins\Offset\ThemeCatalog;

use App\Extension\AbstractPlugin;
use Plugins\Offset\ThemeCatalog\Listeners\ThemeMetaListener;

class Plugin extends AbstractPlugin
{
    public function getDependencies(): array
    {
        return ['sirsoft-board' => '>=1.0.0'];
    }

    public function getHookListeners(): array
    {
        return [ThemeMetaListener::class];
    }

    public function getDynamicTables(): array
    {
        return ['theme_post_metas'];
    }
}
```

- [ ] **Step 4: ServiceProvider 작성** (Repository 바인딩 — 구현은 Task 3에서 채움; 우선 빈 register)

```php
<?php

namespace Plugins\Offset\ThemeCatalog\Providers;

use Illuminate\Support\ServiceProvider;

class ThemeCatalogServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Task 3에서 Repository 인터페이스 바인딩 추가
    }
}
```

- [ ] **Step 5: LICENSE 작성** — 기존 플러그인 LICENSE 복사

```bash
cp plugins/_bundled/sirsoft-marketing/LICENSE plugins/_bundled/offset-theme_catalog/LICENSE
```

- [ ] **Step 6: 설치 + 활성화**

Run:
```bash
php artisan plugin:install offset-theme_catalog
php artisan plugin:activate offset-theme_catalog
php artisan plugin:list
```
Expected: 목록에 `offset-theme_catalog`가 활성으로 표시.

- [ ] **Step 7: 커밋**

```bash
git add plugins/_bundled/offset-theme_catalog
git commit -m "feat(theme-catalog): 플러그인 스캐폴딩 (plugin.json/plugin.php/composer/provider)"
```

---

## Task 2: theme_post_metas 테이블 + 모델

**Files:**
- Create: `plugins/_bundled/offset-theme_catalog/database/migrations/2026_05_29_000001_create_theme_post_metas_table.php`
- Create: `plugins/_bundled/offset-theme_catalog/src/Models/ThemePostMeta.php`

- [ ] **Step 1: 마이그레이션 작성**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('theme_post_metas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained('board_posts')->cascadeOnDelete();
            $table->string('price', 50)->nullable();
            $table->string('license', 100)->nullable();
            $table->string('description_short', 255)->nullable();
            $table->text('description_long')->nullable();
            $table->json('features')->nullable();
            $table->text('changelog')->nullable();
            $table->string('demo_url', 500)->nullable();
            $table->string('purchase_url', 500)->nullable();
            $table->unsignedInteger('download_count')->default(0);
            $table->string('last_update', 50)->nullable();
            $table->text('install_note')->nullable();
            $table->string('min_requirement', 255)->nullable();
            $table->string('rating', 10)->nullable();
            $table->unsignedInteger('review_count')->default(0);
            $table->timestamps();

            $table->unique('post_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('theme_post_metas');
    }
};
```

> 주: `board_posts` 테이블명은 sirsoft-board의 실제 게시글 테이블. Task 0/기존 마이그레이션에서 확인된 이름 사용.

- [ ] **Step 2: 모델 작성**

```php
<?php

namespace Plugins\Offset\ThemeCatalog\Models;

use Illuminate\Database\Eloquent\Model;

class ThemePostMeta extends Model
{
    protected $table = 'theme_post_metas';

    protected $fillable = [
        'post_id', 'price', 'license', 'description_short', 'description_long',
        'features', 'changelog', 'demo_url', 'purchase_url', 'download_count',
        'last_update', 'install_note', 'min_requirement', 'rating', 'review_count',
    ];

    protected $casts = [
        'features' => 'array',
        'download_count' => 'integer',
        'review_count' => 'integer',
    ];
}
```

- [ ] **Step 3: 마이그레이션 반영**

Run:
```bash
php artisan plugin:install offset-theme_catalog --force
php artisan migrate
php artisan tinker --execute="echo \Schema::hasTable('theme_post_metas') ? 'OK' : 'MISSING';"
```
Expected: `OK`

- [ ] **Step 4: 커밋**

```bash
git add plugins/_bundled/offset-theme_catalog/database plugins/_bundled/offset-theme_catalog/src/Models
git commit -m "feat(theme-catalog): theme_post_metas 테이블 + 모델"
```

---

## Task 3: Repository (인터페이스 + 구현 + 바인딩)

**Files:**
- Create: `src/Repositories/Contracts/ThemePostMetaRepositoryInterface.php`
- Create: `src/Repositories/ThemePostMetaRepository.php`
- Modify: `src/Providers/ThemeCatalogServiceProvider.php`
- Test: `tests/Feature/ThemeMetaRepositoryTest.php`

- [ ] **Step 1: 실패 테스트 작성** (upsert + 조회)

```php
<?php

namespace Plugins\Offset\ThemeCatalog\Tests\Feature;

use Tests\TestCase;
use Plugins\Offset\ThemeCatalog\Repositories\Contracts\ThemePostMetaRepositoryInterface;

class ThemeMetaRepositoryTest extends TestCase
{
    public function test_upsert_creates_then_updates(): void
    {
        $repo = app(ThemePostMetaRepositoryInterface::class);
        $repo->upsert(101, ['price' => '49000', 'license' => 'MIT']);
        $this->assertSame('49000', $repo->findByPostId(101)->price);

        $repo->upsert(101, ['price' => '59000']);
        $this->assertSame('59000', $repo->findByPostId(101)->price);
    }
}
```

- [ ] **Step 2: 실패 확인**

Run: `cd plugins/_bundled/offset-theme_catalog && vendor/bin/phpunit tests/Feature/ThemeMetaRepositoryTest.php` (또는 프로젝트 표준 테스트 러너)
Expected: FAIL — `ThemePostMetaRepositoryInterface` 미바인딩.

- [ ] **Step 3: 인터페이스 작성**

```php
<?php

namespace Plugins\Offset\ThemeCatalog\Repositories\Contracts;

use Plugins\Offset\ThemeCatalog\Models\ThemePostMeta;
use Illuminate\Support\Collection;

interface ThemePostMetaRepositoryInterface
{
    public function findByPostId(int $postId): ?ThemePostMeta;
    public function findByPostIds(array $postIds): Collection;
    public function upsert(int $postId, array $data): ThemePostMeta;
    public function deleteByPostId(int $postId): void;
}
```

- [ ] **Step 4: 구현 작성**

```php
<?php

namespace Plugins\Offset\ThemeCatalog\Repositories;

use Illuminate\Support\Collection;
use Plugins\Offset\ThemeCatalog\Models\ThemePostMeta;
use Plugins\Offset\ThemeCatalog\Repositories\Contracts\ThemePostMetaRepositoryInterface;

class ThemePostMetaRepository implements ThemePostMetaRepositoryInterface
{
    public function findByPostId(int $postId): ?ThemePostMeta
    {
        return ThemePostMeta::where('post_id', $postId)->first();
    }

    public function findByPostIds(array $postIds): Collection
    {
        return ThemePostMeta::whereIn('post_id', $postIds)->get()->keyBy('post_id');
    }

    public function upsert(int $postId, array $data): ThemePostMeta
    {
        $meta = ThemePostMeta::firstOrNew(['post_id' => $postId]);
        $meta->fill($data)->save();
        return $meta->fresh();
    }

    public function deleteByPostId(int $postId): void
    {
        ThemePostMeta::where('post_id', $postId)->delete();
    }
}
```

- [ ] **Step 5: ServiceProvider 바인딩 추가**

```php
public function register(): void
{
    $this->app->bind(
        \Plugins\Offset\ThemeCatalog\Repositories\Contracts\ThemePostMetaRepositoryInterface::class,
        \Plugins\Offset\ThemeCatalog\Repositories\ThemePostMetaRepository::class
    );
}
```

- [ ] **Step 6: 통과 확인 + 커밋**

Run: 테스트 러너 → Expected: PASS
```bash
git add plugins/_bundled/offset-theme_catalog/src plugins/_bundled/offset-theme_catalog/tests
git commit -m "feat(theme-catalog): ThemePostMeta Repository + 바인딩"
```

---

## Task 4: 저장 Hook Listener (theme 한정)

**Files:**
- Create: `src/Services/ThemePostMetaService.php`
- Create: `src/Listeners/ThemeMetaListener.php`
- Test: `tests/Feature/ThemeMetaHookTest.php`

> 패턴 출처: `sirsoft-board/src/Listeners/UserNotificationSettingsListener.php` (filter_create_data로 추출→세션 임시→after_create로 저장). 단 hook명은 `sirsoft-board.post.*`, theme slug 한정.

- [ ] **Step 1: 실패 테스트 작성** (theme 게시글 생성 시 메타 저장 / 다른 게시판은 무시)

```php
<?php

namespace Plugins\Offset\ThemeCatalog\Tests\Feature;

use Tests\TestCase;
use App\Extension\HookManager;
use Plugins\Offset\ThemeCatalog\Repositories\Contracts\ThemePostMetaRepositoryInterface;

class ThemeMetaHookTest extends TestCase
{
    public function test_theme_post_meta_extracted_and_saved(): void
    {
        // filter: 요청 데이터에서 메타 추출 + 제거
        $data = HookManager::applyFilters('sirsoft-board.post.filter_create_data',
            ['subject' => 'Theme A', 'price' => '49000', 'license' => 'MIT'], 'theme');
        $this->assertArrayNotHasKey('price', $data, '메타는 Post 데이터에서 제거되어야 함');

        // after: 저장
        $post = (object) ['id' => 501];
        HookManager::doAction('sirsoft-board.post.after_create', $post, 'theme', []);

        $meta = app(ThemePostMetaRepositoryInterface::class)->findByPostId(501);
        $this->assertSame('49000', $meta->price);
    }

    public function test_non_theme_board_ignored(): void
    {
        $data = HookManager::applyFilters('sirsoft-board.post.filter_create_data',
            ['subject' => 'Notice', 'price' => '1'], 'notice');
        $this->assertSame('1', $data['price'] ?? null, 'theme 외 게시판은 건드리지 않음');
    }
}
```

- [ ] **Step 2: 실패 확인** — Listener 미구현으로 메타 미저장/필드 잔존.

- [ ] **Step 3: Service 작성**

```php
<?php

namespace Plugins\Offset\ThemeCatalog\Services;

use Plugins\Offset\ThemeCatalog\Repositories\Contracts\ThemePostMetaRepositoryInterface;

class ThemePostMetaService
{
    public const META_KEYS = [
        'price', 'license', 'description_short', 'description_long', 'features',
        'changelog', 'demo_url', 'purchase_url', 'download_count', 'last_update',
        'install_note', 'min_requirement', 'rating', 'review_count',
    ];

    public function __construct(
        private ThemePostMetaRepositoryInterface $repository,
    ) {}

    public function extract(array $data): array
    {
        return array_intersect_key($data, array_flip(self::META_KEYS));
    }

    public function strip(array $data): array
    {
        return array_diff_key($data, array_flip(self::META_KEYS));
    }

    public function save(int $postId, array $meta): void
    {
        if ($meta !== []) {
            $this->repository->upsert($postId, $meta);
        }
    }

    public function delete(int $postId): void
    {
        $this->repository->deleteByPostId($postId);
    }
}
```

- [ ] **Step 4: Listener 작성** (theme slug 한정, 세션 통로)

```php
<?php

namespace Plugins\Offset\ThemeCatalog\Listeners;

use App\Contracts\Extension\HookListenerInterface;
use Plugins\Offset\ThemeCatalog\Services\ThemePostMetaService;

class ThemeMetaListener implements HookListenerInterface
{
    private const SESSION_KEY = 'offset_theme_catalog.pending_meta';

    public function __construct(
        private ThemePostMetaService $service,
    ) {}

    public static function getSubscribedHooks(): array
    {
        return [
            'sirsoft-board.post.filter_create_data' => ['method' => 'filterCreateData', 'priority' => 10, 'type' => 'filter'],
            'sirsoft-board.post.filter_update_data' => ['method' => 'filterUpdateData', 'priority' => 10, 'type' => 'filter'],
            'sirsoft-board.post.after_create' => ['method' => 'afterCreate', 'priority' => 10],
            'sirsoft-board.post.after_update' => ['method' => 'afterUpdate', 'priority' => 10],
            'sirsoft-board.post.after_delete' => ['method' => 'afterDelete', 'priority' => 10],
            'sirsoft-board.post.store_validation_rules' => ['method' => 'validationRules', 'priority' => 10, 'type' => 'filter'],
            'sirsoft-board.post.update_validation_rules' => ['method' => 'validationRules', 'priority' => 10, 'type' => 'filter'],
        ];
    }

    public function filterCreateData(array $data, string $slug): array
    {
        if ($slug !== 'theme') {
            return $data;
        }
        session([self::SESSION_KEY => $this->service->extract($data)]);
        return $this->service->strip($data);
    }

    public function filterUpdateData(array $data, $post, string $slug): array
    {
        if ($slug !== 'theme') {
            return $data;
        }
        session([self::SESSION_KEY => $this->service->extract($data)]);
        return $this->service->strip($data);
    }

    public function afterCreate($post, string $slug, array $options): void
    {
        if ($slug !== 'theme') {
            return;
        }
        $meta = session(self::SESSION_KEY, []);
        session()->forget(self::SESSION_KEY);
        $this->service->save((int) $post->id, $meta);
    }

    public function afterUpdate($post, string $slug, array $snapshot): void
    {
        if ($slug !== 'theme') {
            return;
        }
        $meta = session(self::SESSION_KEY, []);
        session()->forget(self::SESSION_KEY);
        $this->service->save((int) $post->id, $meta);
    }

    public function afterDelete($post, string $slug, array $options): void
    {
        if ($slug !== 'theme') {
            return;
        }
        $this->service->delete((int) $post->id);
    }

    public function validationRules(array $rules): array
    {
        return array_merge($rules, [
            'price' => ['nullable', 'string', 'max:50'],
            'license' => ['nullable', 'string', 'max:100'],
            'description_short' => ['nullable', 'string', 'max:255'],
            'description_long' => ['nullable', 'string'],
            'features' => ['nullable', 'array'],
            'changelog' => ['nullable', 'string'],
            'demo_url' => ['nullable', 'string', 'max:500'],
            'purchase_url' => ['nullable', 'string', 'max:500'],
            'download_count' => ['nullable', 'integer'],
            'last_update' => ['nullable', 'string', 'max:50'],
            'install_note' => ['nullable', 'string'],
            'min_requirement' => ['nullable', 'string', 'max:255'],
            'rating' => ['nullable', 'string', 'max:10'],
            'review_count' => ['nullable', 'integer'],
        ]);
    }
}
```

> 인자 시그니처는 Task 0 Step 1에서 확정한 값과 일치시킬 것. `validationRules`는 게시판 slug 분기가 필요하면 인자에 slug가 오는지 Task 0에서 확인 후 분기.

- [ ] **Step 5: 통과 확인 + 커밋**

Run: 테스트 러너 → Expected: PASS (2 테스트)
```bash
git add plugins/_bundled/offset-theme_catalog/src plugins/_bundled/offset-theme_catalog/tests
git commit -m "feat(theme-catalog): 저장 hook listener (theme 한정, 세션 통로)"
```

---

## Task 5: 조회 API (Service 조회 + Controller + Resource + route)

**Files:**
- Modify: `src/Services/ThemePostMetaService.php` (조회 메서드 추가)
- Create: `src/Http/Resources/ThemePostMetaResource.php`
- Create: `src/Http/Controllers/ThemeMetaController.php`
- Create: `src/routes/api.php`
- Test: `tests/Feature/ThemeMetaApiTest.php`

- [ ] **Step 1: 실패 테스트 작성**

```php
<?php

namespace Plugins\Offset\ThemeCatalog\Tests\Feature;

use Tests\TestCase;
use Plugins\Offset\ThemeCatalog\Repositories\Contracts\ThemePostMetaRepositoryInterface;

class ThemeMetaApiTest extends TestCase
{
    public function test_single_meta_endpoint(): void
    {
        app(ThemePostMetaRepositoryInterface::class)->upsert(601, ['price' => '49000']);
        $this->getJson('/api/plugins/offset-theme_catalog/posts/601/meta')
            ->assertOk()->assertJsonPath('data.price', '49000');
    }

    public function test_bulk_metas_endpoint(): void
    {
        app(ThemePostMetaRepositoryInterface::class)->upsert(602, ['price' => '1000']);
        $this->getJson('/api/plugins/offset-theme_catalog/theme/metas?post_ids=602')
            ->assertOk()->assertJsonPath('data.0.price', '1000');
    }
}
```

- [ ] **Step 2: 실패 확인** — 라우트 404.

- [ ] **Step 3: Resource 작성**

```php
<?php

namespace Plugins\Offset\ThemeCatalog\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ThemePostMetaResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'post_id' => $this->post_id,
            'price' => $this->price,
            'license' => $this->license,
            'description_short' => $this->description_short,
            'description_long' => $this->description_long,
            'features' => $this->features ?? [],
            'changelog' => $this->changelog,
            'demo_url' => $this->demo_url,
            'purchase_url' => $this->purchase_url,
            'download_count' => $this->download_count,
            'last_update' => $this->last_update,
            'install_note' => $this->install_note,
            'min_requirement' => $this->min_requirement,
            'rating' => $this->rating,
            'review_count' => $this->review_count,
        ];
    }
}
```

- [ ] **Step 4: Service 조회 메서드 추가**

```php
public function getByPostId(int $postId): ?\Plugins\Offset\ThemeCatalog\Models\ThemePostMeta
{
    return $this->repository->findByPostId($postId);
}

public function getByPostIds(array $postIds): \Illuminate\Support\Collection
{
    return $this->repository->findByPostIds($postIds)->values();
}
```

- [ ] **Step 5: Controller 작성**

```php
<?php

namespace Plugins\Offset\ThemeCatalog\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Helpers\ResponseHelper;
use Illuminate\Http\Request;
use Plugins\Offset\ThemeCatalog\Http\Resources\ThemePostMetaResource;
use Plugins\Offset\ThemeCatalog\Services\ThemePostMetaService;

class ThemeMetaController extends Controller
{
    public function __construct(private ThemePostMetaService $service) {}

    public function show(int $postId)
    {
        $meta = $this->service->getByPostId($postId);
        return ResponseHelper::success('messages.success', $meta ? new ThemePostMetaResource($meta) : null);
    }

    public function index(Request $request)
    {
        $ids = array_filter(array_map('intval', explode(',', (string) $request->query('post_ids'))));
        $metas = $this->service->getByPostIds($ids);
        return ResponseHelper::success('messages.success', ThemePostMetaResource::collection($metas));
    }
}
```

> `Controller` 베이스 클래스/`ResponseHelper` 정확 경로는 Task 0에서 본 `MarketingSettingsController`(PublicBaseController 상속, `ResponseHelper::success`)를 따름. 조회는 공개(인증 불요) — theme 카탈로그가 공개이므로. 미들웨어가 필요하면 라우트에 명시.

- [ ] **Step 6: routes/api.php 작성** (자동 `/api/plugins/offset-theme_catalog/` prefix)

```php
<?php

use Illuminate\Support\Facades\Route;
use Plugins\Offset\ThemeCatalog\Http\Controllers\ThemeMetaController;

Route::get('/posts/{postId}/meta', [ThemeMetaController::class, 'show'])->name('meta.show');
Route::get('/theme/metas', [ThemeMetaController::class, 'index'])->name('meta.index');
```

- [ ] **Step 7: 반영 + 통과 확인**

Run:
```bash
php artisan plugin:install offset-theme_catalog --force
php artisan plugin:activate offset-theme_catalog
php artisan route:list | grep offset-theme_catalog
```
테스트 러너 → Expected: PASS (2 테스트)

- [ ] **Step 8: 커밋**

```bash
git add plugins/_bundled/offset-theme_catalog/src
git commit -m "feat(theme-catalog): 메타 조회 API (단건/일괄)"
```

---

## Task 6: Layout Extension — admin 게시글 폼에 메타 필드 주입

**Files:**
- Create: `resources/extensions/theme_post_form.json`

> 패턴 출처: `sirsoft-board/resources/extensions/user-notification-settings.json`. `target_layout`/`target_id`/`position`/`data_sources`는 Task 0 Step 2에서 확정한 값으로.

- [ ] **Step 1: extension JSON 작성** (14필드, theme 게시판일 때만 `if`)

```json
{
  "target_layout": "admin_board_post_form",
  "injections": [
    {
      "target_id": "<TASK0_TARGET_ID>",
      "position": "append",
      "components": [
        {
          "id": "theme_catalog_meta",
          "type": "basic",
          "name": "Div",
          "if": "{{(_local.form?.board?.slug ?? route.slug) === 'theme'}}",
          "props": { "className": "space-y-4 mt-6" },
          "children": [
            { "type": "basic", "name": "H3", "text": "$t:fields.section_title" },
            { "type": "composite", "name": "ExtensionBadge", "props": { "type": "plugin", "identifier": "offset-theme_catalog" } },
            { "type": "basic", "name": "Input", "props": { "name": "price", "value": "{{_local.form?.price ?? meta?.data?.price ?? ''}}" } },
            { "type": "basic", "name": "Input", "props": { "name": "license", "value": "{{_local.form?.license ?? meta?.data?.license ?? ''}}" } },
            { "type": "basic", "name": "Input", "props": { "name": "description_short", "value": "{{_local.form?.description_short ?? meta?.data?.description_short ?? ''}}" } },
            { "type": "basic", "name": "Textarea", "props": { "name": "description_long", "value": "{{_local.form?.description_long ?? meta?.data?.description_long ?? ''}}" } },
            { "type": "basic", "name": "Textarea", "props": { "name": "changelog", "value": "{{_local.form?.changelog ?? meta?.data?.changelog ?? ''}}" } },
            { "type": "basic", "name": "Input", "props": { "name": "demo_url", "value": "{{_local.form?.demo_url ?? meta?.data?.demo_url ?? ''}}" } },
            { "type": "basic", "name": "Input", "props": { "name": "purchase_url", "value": "{{_local.form?.purchase_url ?? meta?.data?.purchase_url ?? ''}}" } },
            { "type": "basic", "name": "Input", "props": { "name": "download_count", "type": "number", "value": "{{_local.form?.download_count ?? meta?.data?.download_count ?? 0}}" } },
            { "type": "basic", "name": "Input", "props": { "name": "last_update", "value": "{{_local.form?.last_update ?? meta?.data?.last_update ?? ''}}" } },
            { "type": "basic", "name": "Textarea", "props": { "name": "install_note", "value": "{{_local.form?.install_note ?? meta?.data?.install_note ?? ''}}" } },
            { "type": "basic", "name": "Input", "props": { "name": "min_requirement", "value": "{{_local.form?.min_requirement ?? meta?.data?.min_requirement ?? ''}}" } },
            { "type": "basic", "name": "Input", "props": { "name": "rating", "value": "{{_local.form?.rating ?? meta?.data?.rating ?? ''}}" } },
            { "type": "basic", "name": "Input", "props": { "name": "review_count", "type": "number", "value": "{{_local.form?.review_count ?? meta?.data?.review_count ?? 0}}" } }
          ]
        }
      ]
    }
  ],
  "data_sources": [
    {
      "id": "meta",
      "type": "api",
      "method": "GET",
      "endpoint": "/api/plugins/offset-theme_catalog/posts/{{route.id}}/meta",
      "auto_fetch": "{{!!route.id}}",
      "auth_required": true
    }
  ],
  "priority": 100
}
```

> `features`(배열)는 단순 Input으로는 부적합 — Task 0의 기존 `_extra_fields_theme.json` features 입력 형태(예: JSON Textarea 또는 동적 리스트)를 확인해 동일 방식으로 추가. 폼 자동바인딩 규칙(`name` prop)은 admin 폼 컨테이너의 `dataKey`에 의존하므로 Task 0에서 확인.

- [ ] **Step 2: 반영 + 확인**

Run:
```bash
php artisan plugin:install offset-theme_catalog --force
php artisan plugin:refresh-layout offset-theme_catalog
php artisan plugin:cache-clear offset-theme_catalog
```
브라우저: admin theme 게시글 작성/수정 폼에서 메타 필드 노출 확인(theme 외 게시판엔 미노출).

- [ ] **Step 3: 커밋**

```bash
git add plugins/_bundled/offset-theme_catalog/resources/extensions
git commit -m "feat(theme-catalog): admin 게시글 폼 메타 필드 layout extension"
```

---

## Task 7: 다국어

**Files:**
- Create: `resources/lang/ko.json`, `resources/lang/en.json`

- [ ] **Step 1: ko.json 작성**

```json
{
  "name": "테마 카탈로그",
  "description": "theme 게시판 게시글에 카탈로그 메타를 더합니다.",
  "fields": {
    "section_title": "테마 카탈로그 정보",
    "price": "가격",
    "license": "라이선스",
    "description_short": "짧은 설명",
    "description_long": "상세 설명",
    "features": "주요 기능",
    "changelog": "변경 이력",
    "demo_url": "데모 URL",
    "purchase_url": "구매 URL",
    "download_count": "다운로드 수",
    "last_update": "최종 업데이트",
    "install_note": "설치 안내",
    "min_requirement": "최소 요구사항",
    "rating": "평점",
    "review_count": "리뷰 수"
  }
}
```

- [ ] **Step 2: en.json 작성** (동일 키, 영문 값)

```json
{
  "name": "Theme Catalog",
  "description": "Adds catalog meta to theme board posts.",
  "fields": {
    "section_title": "Theme Catalog Info",
    "price": "Price",
    "license": "License",
    "description_short": "Short Description",
    "description_long": "Long Description",
    "features": "Features",
    "changelog": "Changelog",
    "demo_url": "Demo URL",
    "purchase_url": "Purchase URL",
    "download_count": "Downloads",
    "last_update": "Last Update",
    "install_note": "Install Note",
    "min_requirement": "Min Requirement",
    "rating": "Rating",
    "review_count": "Reviews"
  }
}
```

- [ ] **Step 3: 검증 + 커밋**

Run: `php artisan plugin:install offset-theme_catalog --force && /g7-validate-i18n` (또는 i18n 검증 스킬)
```bash
git add plugins/_bundled/offset-theme_catalog/resources/lang
git commit -m "feat(theme-catalog): 다국어(ko/en)"
```

---

## Task 8: 데이터 이전 (extra_data → theme_post_metas)

**Files:**
- Create: `src/Console/Commands/MigrateThemeMetaCommand.php`
- Test: `tests/Feature/MigrateThemeMetaTest.php`

- [ ] **Step 1: 실패 테스트 작성** (기존 extra_data를 가진 게시글 → 메타 이전, 멱등)

```php
<?php

namespace Plugins\Offset\ThemeCatalog\Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\DB;
use Plugins\Offset\ThemeCatalog\Repositories\Contracts\ThemePostMetaRepositoryInterface;

class MigrateThemeMetaTest extends TestCase
{
    public function test_migrates_extra_data_idempotently(): void
    {
        // theme 게시판 게시글 + extra_data 픽스처는 테스트 세팅에서 생성
        $postId = $this->seedThemePostWithExtraData(['price' => '49000', 'license' => 'MIT']);

        $this->artisan('offset-theme_catalog:migrate-meta')->assertExitCode(0);
        $this->assertSame('49000', app(ThemePostMetaRepositoryInterface::class)->findByPostId($postId)->price);

        // 멱등: 재실행해도 중복/오류 없음
        $this->artisan('offset-theme_catalog:migrate-meta')->assertExitCode(0);
        $this->assertSame(1, DB::table('theme_post_metas')->where('post_id', $postId)->count());
    }
}
```

- [ ] **Step 2: 실패 확인** — 커맨드 미존재.

- [ ] **Step 3: 커맨드 작성**

```php
<?php

namespace Plugins\Offset\ThemeCatalog\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Plugins\Offset\ThemeCatalog\Services\ThemePostMetaService;

class MigrateThemeMetaCommand extends Command
{
    protected $signature = 'offset-theme_catalog:migrate-meta {--slug=theme}';
    protected $description = 'board_posts.extra_data 의 theme 메타를 theme_post_metas 로 이전(멱등)';

    public function handle(ThemePostMetaService $service): int
    {
        if (! Schema::hasColumn('board_posts', 'extra_data')) {
            $this->warn('extra_data 컬럼이 없습니다. 이미 정리되었거나 대상이 없습니다.');
            return self::SUCCESS;
        }

        $boardId = DB::table('boards')->where('slug', $this->option('slug'))->value('id');
        $posts = DB::table('board_posts')
            ->where('board_id', $boardId)
            ->whereNotNull('extra_data')
            ->get(['id', 'extra_data']);

        foreach ($posts as $post) {
            $extra = json_decode($post->extra_data ?? '{}', true) ?: [];
            $meta = $service->extract($extra);
            $service->save((int) $post->id, $meta);
            $this->info("post #{$post->id} 메타 이전 완료");
        }

        $this->info("총 {$posts->count()}건 이전.");
        return self::SUCCESS;
    }
}
```

> `boards`/`board_posts` 테이블·컬럼명(`slug`, `board_id`, `extra_data`)은 Task 0 / 기존 마이그레이션에서 확인된 값. 커맨드 등록은 plugin 디렉토리의 Console 자동 발견 여부를 `php artisan plugin:list`/`php artisan list`로 확인; 자동 발견이 안 되면 ServiceProvider `boot()`에서 `$this->commands([...])` (runningInConsole 가드).

- [ ] **Step 4: 실서버 이전 실행** (원복 **전에** — extra_data가 아직 있을 때)

Run:
```bash
php artisan plugin:install offset-theme_catalog --force
php artisan offset-theme_catalog:migrate-meta
php artisan tinker --execute="echo \DB::table('theme_post_metas')->count();"
```
Expected: 기존 theme 게시글 수(=4)만큼 메타 행 생성.

- [ ] **Step 5: 통과 확인 + 커밋**

```bash
git add plugins/_bundled/offset-theme_catalog/src plugins/_bundled/offset-theme_catalog/tests
git commit -m "feat(theme-catalog): extra_data→theme_post_metas 이전 커맨드(멱등)"
```

---

## Task 9: sirsoft-board 원복 + extra_data 컬럼 제거

> **선행 조건: Task 8의 데이터 이전이 완료되어 theme_post_metas에 메타가 있어야 한다.**

**Files:**
- Restore/Delete: sirsoft-board 11파일 (File Structure 참조)
- Create: `plugins/_bundled/offset-theme_catalog/database/migrations/2026_05_29_000002_drop_extra_data_from_board_posts.php`

- [ ] **Step 1: 원복 전 안전 확인**

Run: `php artisan tinker --execute="echo \DB::table('theme_post_metas')->count();"`
Expected: > 0 (이전 완료). 0이면 중단하고 Task 8 재실행.

- [ ] **Step 2: sirsoft-board 소스 원복 (beta.6 = 61f5874)**

```bash
git checkout 61f5874 -- \
  modules/_bundled/sirsoft-board/src/Models/Post.php \
  modules/_bundled/sirsoft-board/src/Http/Resources/PostResource.php \
  modules/_bundled/sirsoft-board/src/Http/Requests/StorePostRequest.php \
  modules/_bundled/sirsoft-board/src/Http/Requests/UpdatePostRequest.php \
  modules/_bundled/sirsoft-board/src/Repositories/PostRepository.php \
  modules/_bundled/sirsoft-board/src/Providers/BoardServiceProvider.php \
  modules/_bundled/sirsoft-board/resources/layouts/admin/admin_board_post_form.json \
  modules/_bundled/sirsoft-board/resources/layouts/admin/partials/admin_board_post_form/_form_fields.json
git rm \
  modules/_bundled/sirsoft-board/resources/layouts/admin/partials/admin_board_post_form/_extra_fields_theme.json \
  modules/_bundled/sirsoft-board/src/Console/Commands/MigrateThemeImagesCommand.php \
  modules/_bundled/sirsoft-board/database/migrations/2026_05_18_000001_add_extra_data_to_board_posts.php
```

- [ ] **Step 3: extra_data 컬럼 drop 마이그레이션 작성** (플러그인 소유)

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasColumn('board_posts', 'extra_data')) {
            Schema::table('board_posts', function (Blueprint $table) {
                $table->dropColumn('extra_data');
            });
        }
    }

    public function down(): void
    {
        if (! Schema::hasColumn('board_posts', 'extra_data')) {
            Schema::table('board_posts', function (Blueprint $table) {
                $table->json('extra_data')->nullable();
            });
        }
    }
};
```

- [ ] **Step 4: sirsoft-board 재반영 + 컬럼 drop 적용**

Run:
```bash
php artisan module:install sirsoft-board --force
php artisan module:refresh-layout sirsoft-board
php artisan plugin:install offset-theme_catalog --force
php artisan migrate
php artisan tinker --execute="echo \Schema::hasColumn('board_posts','extra_data') ? 'STILL THERE' : 'DROPPED';"
```
Expected: `DROPPED`

- [ ] **Step 5: sirsoft-board 본사 테스트 (원복 후 green)**

Run: `cd modules/_bundled/sirsoft-board && (테스트 러너)` 또는 `/g7-run-tests`
Expected: PASS (본사 원본 테스트 회귀 없음).

- [ ] **Step 6: 커밋**

```bash
git add modules/_bundled/sirsoft-board plugins/_bundled/offset-theme_catalog/database
git commit -m "refactor(board): sirsoft-board 메타 직접수정 11파일 원복 + extra_data 컬럼 제거(플러그인 이관)"
```

---

## Task 10: ryan-offset 프론트 재배선 (메타 소스 교체)

**Files:**
- Modify: `templates/_bundled/ryan-offset/layouts/board/themes_index.json`
- Modify: `templates/_bundled/ryan-offset/layouts/board/themes_show.json`

> Task 0 Step 3에서 확인한 `ThemeListSection`/`ThemeDetailContent`의 메타 소비 형태에 맞춰 매핑. 이미지(썸네일/갤러리) 바인딩은 그대로 둔다.

- [ ] **Step 1: themes_show.json — 메타 data_source 추가**

기존 게시글 data_source 옆에 단건 메타 소스 추가:
```json
{
  "id": "themeMeta",
  "type": "api",
  "method": "GET",
  "endpoint": "/api/plugins/offset-theme_catalog/posts/{{route.id}}/meta",
  "auto_fetch": true,
  "auth_required": false
}
```
그리고 14개 필드 바인딩을 `post.data.extra_data?.X` → `themeMeta?.data?.X ?? ''` 로 교체.

- [ ] **Step 2: themes_index.json — 목록 메타 data_source 추가**

목록 게시글 id들로 일괄 조회:
```json
{
  "id": "themeMetas",
  "type": "api",
  "method": "GET",
  "endpoint": "/api/plugins/offset-theme_catalog/theme/metas?post_ids={{(posts?.data?.data ?? []).map(p => p.id).join(',')}}",
  "auto_fetch": true,
  "auth_required": false
}
```
카드의 `price`/`description_short`를 `extra_data` → `themeMetas` 응답에서 post_id 매칭으로 바인딩. (매칭 표현식 형태는 ThemeListSection 입력 prop에 맞춤 — Task 0 확인.)

- [ ] **Step 3: 빌드/반영**

Run:
```bash
php artisan template:build ryan-offset
php artisan template:install ryan-offset --force
php artisan template:activate ryan-offset
php artisan template:refresh-layout ryan-offset
php artisan template:cache-clear ryan-offset
```

- [ ] **Step 4: 레이아웃 회귀 테스트**

Run: `cd templates/_bundled/ryan-offset && npm run test:run -- layouts`
Expected: 기존 레이아웃 테스트 PASS(회귀 없음).

- [ ] **Step 5: 커밋**

```bash
git add templates/_bundled/ryan-offset/layouts/board
git commit -m "refactor(offset): theme 목록·상세 메타 바인딩을 플러그인 API로 재배선"
```

---

## Task 11: 통합 검증 (완료 정의)

**Files:** (없음 — 검증/수정만)

- [ ] **Step 1: 검증 스킬 일괄**

Run:
```
/g7-validate-backend   # 플러그인 listener/service/repository/마이그레이션
/g7-validate-frontend  # extension JSON + ryan-offset 레이아웃
/g7-validate-hook      # hook 구독/타입
/g7-validate-migration # 마이그레이션
```
모든 위반 0으로 수렴(있으면 수정 후 재실행).

- [ ] **Step 2: 브라우저 end-to-end (pm2 서버 :8000)**

체크리스트:
- `/board/theme` 목록 — 카드에 가격/짧은설명 표시, 썸네일(attachment) 정상
- `/board/theme/{id}` 상세 — 14필드 메타 + 갤러리 이미지 정상, sirsoft-basic 요청 0 / 404 0
- admin theme 게시글 작성 → 메타 입력 → 저장 → 목록/상세 반영 (end-to-end)
- admin 비-theme 게시판 폼엔 메타 필드 미노출
- 게시글 삭제 → 메타 행 삭제 확인

- [ ] **Step 3: 플러그인 전체 테스트 통과**

Run: 플러그인 테스트 러너 → Expected: 모든 Feature 테스트 PASS.

- [ ] **Step 4: 최종 커밋(필요 시) + 정리**

```bash
git status
# 잔여 변경 정리 후
git commit -m "test(theme-catalog): 통합 검증 통과"
```

---

## 완료 기준

- `sirsoft-board` git diff(현재 vs 61f5874) = **0** (공식 무수정 복귀)
- theme 메타가 플러그인 `theme_post_metas`에 저장/조회되고, admin 폼·user 화면 모두 정상
- 이미지 첨부는 유지, sirsoft-basic 잔재 요청/404 없음
- 검증 스킬 4종 통과 + 플러그인/레이아웃/본사 테스트 green
