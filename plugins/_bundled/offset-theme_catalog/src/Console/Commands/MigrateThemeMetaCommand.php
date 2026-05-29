<?php

namespace Plugins\Offset\ThemeCatalog\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Plugins\Offset\ThemeCatalog\Services\ThemePostMetaService;

/**
 * board_posts.extra_data 의 theme 메타를 theme_post_metas 로 이전(멱등).
 * sirsoft-board 원복(extra_data 컬럼 제거) 전에 1회 실행한다.
 */
class MigrateThemeMetaCommand extends Command
{
    protected $signature = 'offset-theme_catalog:migrate-meta {--slug=theme}';

    protected $description = 'board_posts.extra_data 의 theme 메타를 theme_post_metas 로 이전(멱등)';

    public function handle(ThemePostMetaService $service): int
    {
        if (! Schema::hasColumn('board_posts', 'extra_data')) {
            $this->warn('board_posts.extra_data 컬럼이 없습니다. 이미 정리되었거나 대상이 없습니다.');

            return self::SUCCESS;
        }

        $boardId = DB::table('boards')->where('slug', $this->option('slug'))->value('id');
        if (! $boardId) {
            $this->error("게시판 slug='{$this->option('slug')}' 를 찾을 수 없습니다.");

            return self::FAILURE;
        }

        $posts = DB::table('board_posts')
            ->where('board_id', $boardId)
            ->whereNotNull('extra_data')
            ->get(['id', 'extra_data']);

        $migrated = 0;
        foreach ($posts as $post) {
            $extra = json_decode($post->extra_data ?? '{}', true) ?: [];
            $meta = $service->extract($extra);
            if ($meta === []) {
                continue;
            }
            $service->save((int) $post->id, $meta);
            $migrated++;
            $this->info("post #{$post->id} 메타 이전 완료 (".implode(', ', array_keys($meta)).')');
        }

        $this->info("총 {$migrated}건 이전 완료.");

        return self::SUCCESS;
    }
}
