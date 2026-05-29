<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('theme_post_metas', function (Blueprint $table) {
            $table->id();
            // board_posts 는 복합 PK (id, board_id) 라 단순 FK 불가 → post_id 인덱스 컬럼.
            // 게시글 삭제 시 메타 정리는 sirsoft-board.post.after_delete hook 이 담당.
            $table->unsignedBigInteger('post_id');
            $table->string('price', 50)->nullable();
            $table->string('license', 100)->nullable();
            $table->string('description_short', 255)->nullable();
            $table->text('description_long')->nullable();
            $table->json('features')->nullable();
            $table->text('changelog')->nullable();
            $table->string('demo_url', 500)->nullable();
            $table->string('purchase_url', 500)->nullable();
            $table->unsignedInteger('download_count')->default(0);
            $table->string('last_update', 50)->nullable();
            $table->text('install_note')->nullable();
            $table->string('min_requirement', 255)->nullable();
            $table->string('rating', 10)->nullable();
            $table->unsignedInteger('review_count')->default(0);
            $table->timestamps();

            $table->unique('post_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('theme_post_metas');
    }
};
