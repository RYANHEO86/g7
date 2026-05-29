<?php

namespace Plugins\Offset\ThemeCatalog\Tests\Feature;

use Plugins\Offset\ThemeCatalog\Repositories\Contracts\ThemePostMetaRepositoryInterface;
use Plugins\Offset\ThemeCatalog\Tests\PluginTestCase;

class ThemeMetaRepositoryTest extends PluginTestCase
{
    public function test_upsert_creates_then_updates(): void
    {
        $repo = app(ThemePostMetaRepositoryInterface::class);

        $repo->upsert(101, ['price' => '49000', 'license' => 'MIT']);
        $this->assertSame('49000', $repo->findByPostId(101)->price);

        $repo->upsert(101, ['price' => '59000']);
        $this->assertSame('59000', $repo->findByPostId(101)->price);
        $this->assertSame('MIT', $repo->findByPostId(101)->license);
    }

    public function test_find_by_post_ids_returns_keyed_collection(): void
    {
        $repo = app(ThemePostMetaRepositoryInterface::class);
        $repo->upsert(201, ['price' => '1000']);
        $repo->upsert(202, ['price' => '2000']);

        $result = $repo->findByPostIds([201, 202, 999]);

        $this->assertCount(2, $result);
        $this->assertSame('1000', $result[201]->price);
    }

    public function test_delete_by_post_id(): void
    {
        $repo = app(ThemePostMetaRepositoryInterface::class);
        $repo->upsert(301, ['price' => '500']);
        $repo->deleteByPostId(301);

        $this->assertNull($repo->findByPostId(301));
    }
}
