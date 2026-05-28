<?php

namespace Modules\Sirsoft\Board\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Modules\Sirsoft\Board\Models\Board;
use Modules\Sirsoft\Board\Models\Post;

/**
 * 테마 게시판 이미지 마이그레이션 커맨드.
 *
 * 테마 게시글의 extra_data.thumbnail / gallery_images 에 박혀 있던
 * "특정 템플릿 절대경로" 이미지를 그누7 정석인 첨부(attachment) 기반으로 옮긴다.
 * 템플릿 자산 파일을 storage 로 복사해 board_attachments 레코드를 만들고,
 * extra_data 의 이미지 키는 제거한다. 멱등(재실행 시 이미지 첨부가 있으면 skip).
 */
class MigrateThemeImagesCommand extends Command
{
    protected $signature = 'sirsoft-board:migrate-theme-images {slug=theme} {--template=ryan-offset}';

    protected $description = '테마 게시판 게시글의 extra_data 이미지 URL을 첨부(attachment) 기반으로 마이그레이션합니다';

    public function handle(): int
    {
        $slug = $this->argument('slug');
        $template = $this->option('template');

        $board = Board::where('slug', $slug)->first();
        if (! $board) {
            $this->error("게시판을 찾을 수 없습니다: {$slug}");

            return self::FAILURE;
        }

        // 1) 첨부 업로드 사용 설정 (관리자 폼에 FileUploader 노출)
        if (! $board->use_file_upload) {
            $board->use_file_upload = true;
            $board->save();
            $this->info("use_file_upload 활성화: {$slug}");
        }

        $assetDir = base_path("templates/{$template}/assets/images/aict/themes");
        if (! is_dir($assetDir)) {
            $this->error("자산 디렉토리가 없습니다: {$assetDir}");

            return self::FAILURE;
        }

        $posts = Post::where('board_id', $board->id)->get();
        $this->info("대상 게시글: {$posts->count()}개");

        $migrated = 0;
        foreach ($posts as $post) {
            // 멱등성: 이미지 첨부가 이미 있으면 건너뜀
            $hasImage = DB::table('board_attachments')
                ->where('board_id', $board->id)
                ->where('post_id', $post->id)
                ->where('mime_type', 'like', 'image/%')
                ->whereNull('deleted_at')
                ->exists();
            if ($hasImage) {
                $this->line("  - Post {$post->id}: 이미지 첨부 이미 존재 → skip");

                continue;
            }

            $extra = is_array($post->extra_data) ? $post->extra_data : [];

            // gallery_images 우선, 없으면 thumbnail 단일
            $urls = [];
            if (! empty($extra['gallery_images']) && is_array($extra['gallery_images'])) {
                $urls = $extra['gallery_images'];
            } elseif (! empty($extra['thumbnail'])) {
                $urls = [$extra['thumbnail']];
            }

            if (empty($urls)) {
                $this->line("  - Post {$post->id}: 이미지 경로 없음 → skip");

                continue;
            }

            $order = 0;
            foreach ($urls as $url) {
                $basename = basename(parse_url((string) $url, PHP_URL_PATH) ?: (string) $url);
                $src = "{$assetDir}/{$basename}";
                if (! is_file($src)) {
                    $this->warn("    - 자산 파일 없음: {$basename} → skip");

                    continue;
                }

                $content = file_get_contents($src);
                $dimensions = @getimagesizefromstring($content) ?: [];
                $width = $dimensions[0] ?? null;
                $height = $dimensions[1] ?? null;

                $stored = Str::uuid()->toString().'.jpg';
                $path = "{$slug}/".date('Y/m/d')."/{$stored}";
                Storage::disk('modules')->put("sirsoft-board/attachments/{$path}", $content);

                $order++;
                DB::table('board_attachments')->insert([
                    'board_id' => $board->id,
                    'post_id' => $post->id,
                    'hash' => Str::random(12),
                    'original_filename' => $basename,
                    'stored_filename' => $stored,
                    'disk' => 'modules',
                    'path' => $path,
                    'mime_type' => 'image/jpeg',
                    'size' => strlen($content),
                    'collection' => 'attachments',
                    'order' => $order,
                    'meta' => json_encode(['width' => $width, 'height' => $height]),
                    'created_by' => $post->user_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // 첨부로 대체됐으므로 extra_data 의 이미지 키 제거
            unset($extra['thumbnail'], $extra['gallery_images']);
            $post->extra_data = $extra;
            $post->save();

            $migrated++;
            $this->info("  Post {$post->id}: 첨부 {$order}개 등록 + extra_data 정리");
        }

        $this->info("완료: {$migrated}개 게시글 마이그레이션됨");

        return self::SUCCESS;
    }
}
