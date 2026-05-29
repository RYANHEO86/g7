<?php

namespace Plugins\Offset\ThemeCatalog\Tests\Feature;

use Plugins\Offset\ThemeCatalog\Repositories\Contracts\ThemePostMetaRepositoryInterface;
use Plugins\Offset\ThemeCatalog\Tests\PluginTestCase;

class ThemeMetaApiTest extends PluginTestCase
{
    public function test_single_meta_endpoint(): void
    {
        app(ThemePostMetaRepositoryInterface::class)->upsert(601, ['price' => '49000', 'license' => 'MIT']);

        $this->getJson('/api/plugins/offset-theme_catalog/posts/601/meta')
            ->assertOk()
            ->assertJsonPath('data.price', '49000')
            ->assertJsonPath('data.license', 'MIT');
    }

    public function test_bulk_metas_endpoint(): void
    {
        app(ThemePostMetaRepositoryInterface::class)->upsert(602, ['price' => '1000']);
        app(ThemePostMetaRepositoryInterface::class)->upsert(603, ['price' => '2000']);

        $this->getJson('/api/plugins/offset-theme_catalog/theme/metas?post_ids=602,603')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_index_returns_all_when_no_post_ids(): void
    {
        app(ThemePostMetaRepositoryInterface::class)->upsert(701, ['price' => '1']);
        app(ThemePostMetaRepositoryInterface::class)->upsert(702, ['price' => '2']);

        $this->getJson('/api/plugins/offset-theme_catalog/theme/metas')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }
}
