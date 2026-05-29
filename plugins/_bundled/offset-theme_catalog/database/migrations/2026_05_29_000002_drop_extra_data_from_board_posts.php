<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * theme 메타를 theme_post_metas 로 이전 완료 후, board_posts 의 extra_data 컬럼 제거.
 * (extra_data 는 본사 원본엔 없던 컬럼 — 과거 직접수정 흔적 정리)
 */
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
