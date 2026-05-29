<?php

use Illuminate\Support\Facades\Route;
use Plugins\Offset\Support\Http\Controllers\QuestionController;

// 자동 prefix: /api/plugins/offset-support/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/my-questions', [QuestionController::class, 'index'])->name('my-questions');
});
