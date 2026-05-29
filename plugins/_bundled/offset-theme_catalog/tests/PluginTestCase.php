<?php

namespace Plugins\Offset\ThemeCatalog\Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Plugins\Offset\ThemeCatalog\Repositories\Contracts\ThemePostMetaRepositoryInterface;
use Plugins\Offset\ThemeCatalog\Repositories\ThemePostMetaRepository;
use Tests\TestCase;

/**
 * 테마 카탈로그 플러그인 테스트 베이스.
 * 테스트 환경에선 플러그인이 자동 로드되지 않으므로 bind/route/hook 을 직접 등록한다.
 * (marketing 플러그인 PluginTestCase 패턴)
 */
abstract class PluginTestCase extends TestCase
{
    use RefreshDatabase;

    /** @var array{hooks: array, filters: array, dispatching: array}|null */
    private ?array $hookSnapshot = null;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->bind(ThemePostMetaRepositoryInterface::class, ThemePostMetaRepository::class);

        $this->snapshotHookManager();
    }

    protected function tearDown(): void
    {
        $this->restoreHookManager();

        parent::tearDown();
    }

    private function snapshotHookManager(): void
    {
        $ref = new \ReflectionClass(\App\Extension\HookManager::class);
        $this->hookSnapshot = [
            'hooks' => $ref->getProperty('hooks')->getValue(),
            'filters' => $ref->getProperty('filters')->getValue(),
            'dispatching' => $ref->getProperty('dispatching')->getValue(),
        ];
    }

    private function restoreHookManager(): void
    {
        if ($this->hookSnapshot === null) {
            return;
        }

        $ref = new \ReflectionClass(\App\Extension\HookManager::class);
        $ref->getProperty('hooks')->setValue(null, $this->hookSnapshot['hooks']);
        $ref->getProperty('filters')->setValue(null, $this->hookSnapshot['filters']);
        $ref->getProperty('dispatching')->setValue(null, $this->hookSnapshot['dispatching']);

        $this->hookSnapshot = null;
    }

    /**
     * RefreshDatabase 가 코어 + 모든 _bundled 확장 마이그레이션을 포함하도록 경로 구성.
     */
    protected function migrateFreshUsing(): array
    {
        $paths = ['database/migrations'];
        foreach (glob(base_path('modules/_bundled/*/database/migrations'), GLOB_ONLYDIR) as $p) {
            $paths[] = str_replace(base_path().DIRECTORY_SEPARATOR, '', $p);
        }
        foreach (glob(base_path('plugins/_bundled/*/database/migrations'), GLOB_ONLYDIR) as $p) {
            $paths[] = str_replace(base_path().DIRECTORY_SEPARATOR, '', $p);
        }

        return [
            '--drop-views' => $this->shouldDropViews(),
            '--drop-types' => $this->shouldDropTypes(),
            '--seed' => false,
            '--path' => $paths,
        ];
    }
}
