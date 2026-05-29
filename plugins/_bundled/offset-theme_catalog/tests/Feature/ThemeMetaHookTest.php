<?php

namespace Plugins\Offset\ThemeCatalog\Tests\Feature;

use Plugins\Offset\ThemeCatalog\Listeners\ThemeMetaListener;
use Plugins\Offset\ThemeCatalog\Repositories\Contracts\ThemePostMetaRepositoryInterface;
use Plugins\Offset\ThemeCatalog\Tests\PluginTestCase;

class ThemeMetaHookTest extends PluginTestCase
{
    public function test_theme_meta_extracted_then_saved(): void
    {
        $listener = app(ThemeMetaListener::class);

        // filter: 메타 추출 + Post 데이터에서 제거
        $data = $listener->filterCreateData(
            ['subject' => 'Theme A', 'content' => '...', 'price' => '49000', 'license' => 'MIT'],
            'theme'
        );
        $this->assertArrayNotHasKey('price', $data, '메타는 Post 데이터에서 제거되어야 함');
        $this->assertArrayHasKey('subject', $data, '비-메타 필드는 유지되어야 함');

        // after: 별도 테이블 저장
        $listener->afterCreate((object) ['id' => 501], 'theme', []);

        $meta = app(ThemePostMetaRepositoryInterface::class)->findByPostId(501);
        $this->assertSame('49000', $meta->price);
        $this->assertSame('MIT', $meta->license);
    }

    public function test_non_theme_board_is_ignored(): void
    {
        $listener = app(ThemeMetaListener::class);

        $data = $listener->filterCreateData(['subject' => 'Notice', 'price' => '1'], 'notice');
        $this->assertSame('1', $data['price'] ?? null, 'theme 외 게시판은 메타를 건드리지 않음');

        $listener->afterCreate((object) ['id' => 777], 'notice', []);
        $this->assertNull(app(ThemePostMetaRepositoryInterface::class)->findByPostId(777));
    }

    public function test_after_delete_removes_meta(): void
    {
        $repo = app(ThemePostMetaRepositoryInterface::class);
        $repo->upsert(601, ['price' => '1000']);

        app(ThemeMetaListener::class)->afterDelete((object) ['id' => 601], 'theme', []);

        $this->assertNull($repo->findByPostId(601));
    }

    public function test_validation_rules_merged(): void
    {
        $rules = app(ThemeMetaListener::class)->validationRules(['subject' => ['required']]);
        $this->assertArrayHasKey('price', $rules);
        $this->assertArrayHasKey('subject', $rules);
    }
}
