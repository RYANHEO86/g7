<?php

namespace Plugins\Offset\ThemeCatalog\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Api\Base\PublicBaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Plugins\Offset\ThemeCatalog\Http\Resources\ThemePostMetaResource;
use Plugins\Offset\ThemeCatalog\Services\ThemePostMetaService;

/**
 * theme 게시판 게시글의 카탈로그 메타 공개 조회 컨트롤러.
 */
class ThemeMetaController extends PublicBaseController
{
    public function __construct(
        private ThemePostMetaService $service,
    ) {
        parent::__construct();
    }

    /** 단건 메타 (상세 화면용). */
    public function show(int $postId): JsonResponse
    {
        $meta = $this->service->getByPostId($postId);

        return ResponseHelper::success('messages.success', $meta ? new ThemePostMetaResource($meta) : null);
    }

    /** 다건 메타 (목록 카드용). post_ids=1,2,3 */
    public function index(Request $request): JsonResponse
    {
        $idsParam = (string) $request->query('post_ids');
        if ($idsParam !== '') {
            $ids = array_values(array_filter(array_map('intval', explode(',', $idsParam))));
            $metas = $this->service->getByPostIds($ids);
        } else {
            $metas = $this->service->getAllMetas();
        }

        return ResponseHelper::success('messages.success', ThemePostMetaResource::collection($metas));
    }
}
