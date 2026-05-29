<?php

namespace Plugins\Offset\Support\Repositories\Contracts;

use Illuminate\Support\Collection;

interface QuestionRepositoryInterface
{
    /** qna 게시판에서 해당 사용자가 작성한 글 목록 (최신순). */
    public function findMineByUser(int $userId, int $limit = 50): Collection;
}
