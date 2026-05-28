<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * board_posts 테이블에 extra_data JSON 컬럼 추가.
     *
     * 그누보드5 의 wr_1~wr_10 같은 고정 여분필드를 대체하여,
     * 게시판 slug 별로 자유로운 도메인 필드(가격/라이센스/changelog/features/demo_url 등)
     * 를 JSON 으로 저장한다. Post 모델의 $casts 에 'extra_data' => 'array' 를 등록하면
     * PHP 배열 ↔ JSON 자동 변환된다.
     */
    public function up(): void
    {
        Schema::table('board_posts', function (Blueprint $table) {
            if (! Schema::hasColumn('board_posts', 'extra_data')) {
                $table->json('extra_data')
                    ->nullable()
                    ->after('content')
                    ->comment('게시판 도메인별 자유 추가필드 (JSON) — 예: 테마 카탈로그의 가격/라이센스/changelog 등');
            }
        });
    }

    /**
     * 마이그레이션 롤백
     */
    public function down(): void
    {
        if (Schema::hasTable('board_posts')) {
            $columns = Schema::getColumnListing('board_posts');

            Schema::table('board_posts', function (Blueprint $table) use ($columns) {
                if (in_array('extra_data', $columns)) {
                    $table->dropColumn('extra_data');
                }
            });
        }
    }
};
