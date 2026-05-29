<?php

use Illuminate\Support\Facades\Route;
use Plugins\Offset\ThemeCatalog\Http\Controllers\ThemeMetaController;

// 자동 prefix: /api/plugins/offset-theme_catalog/
Route::get('/posts/{postId}/meta', [ThemeMetaController::class, 'show'])->name('meta.show');
Route::get('/theme/metas', [ThemeMetaController::class, 'index'])->name('meta.index');
