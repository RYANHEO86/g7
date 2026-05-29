<?php

namespace Plugins\Offset\Support\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Api\Base\PublicBaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Plugins\Offset\Support\Http\Resources\QuestionResource;
use Plugins\Offset\Support\Services\QuestionService;

/**
 * 로그인 사용자 본인의 문의(qna) 목록 조회.
 */
class QuestionController extends PublicBaseController
{
    public function __construct(
        private QuestionService $service,
    ) {
        parent::__construct();
    }

    public function index(): JsonResponse
    {
        $userId = Auth::id();
        if (! $userId) {
            return ResponseHelper::success('messages.success', []);
        }

        $items = $this->service->getMine((int) $userId);

        return ResponseHelper::success('messages.success', QuestionResource::collection($items));
    }
}
