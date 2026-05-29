<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * 테마 호환 빌더 코드(rebuilder / gnuboard5 / amina ...) 컬럼 추가.
 * 기존 테마는 모두 리빌더이므로 default 'rebuilder' 로 자동 채움.
 */
return new class extends Migration {
    public function up(): void
    {
        if (! Schema::hasColumn('theme_post_metas', 'builder')) {
            Schema::table('theme_post_metas', function (Blueprint $table) {
                $table->string('builder', 30)->default('rebuilder')->after('post_id');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('theme_post_metas', 'builder')) {
            Schema::table('theme_post_metas', function (Blueprint $table) {
                $table->dropColumn('builder');
            });
        }
    }
};
