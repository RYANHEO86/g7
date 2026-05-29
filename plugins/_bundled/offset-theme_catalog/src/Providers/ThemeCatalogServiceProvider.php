<?php

namespace Plugins\Offset\ThemeCatalog\Providers;

use Illuminate\Support\ServiceProvider;
use Plugins\Offset\ThemeCatalog\Repositories\Contracts\ThemePostMetaRepositoryInterface;
use Plugins\Offset\ThemeCatalog\Repositories\ThemePostMetaRepository;

/**
 * 테마 카탈로그 플러그인 서비스 프로바이더.
 * Repository 인터페이스 ↔ 구현체 바인딩.
 */
class ThemeCatalogServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            ThemePostMetaRepositoryInterface::class,
            ThemePostMetaRepository::class
        );
    }
}
