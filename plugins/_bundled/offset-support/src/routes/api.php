<?php

use Illuminate\Support\Facades\Route;
use Plugins\Offset\Support\Http\Controllers\QuestionController;

// 자동 prefix: /api/plugins/offset-support/
// optional.sanctum: 토큰 있으면 인증, 없으면 게스트로 통과(컨트롤러가 Auth::id()로 분기).
// auth:sanctum 이면 비인증 시 web 'login' 라우트로 리다이렉트 시도 → 'login' 미정의 500.
Route::middleware('optional.sanctum')->group(function () {
    Route::get('/my-questions', [QuestionController::class, 'index'])->name('my-questions');
});
