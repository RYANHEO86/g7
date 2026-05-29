<?php

namespace Plugins\Offset\Support\Services;

use Illuminate\Support\Collection;
use Plugins\Offset\Support\Repositories\Contracts\QuestionRepositoryInterface;

class QuestionService
{
    public function __construct(
        private QuestionRepositoryInterface $repository,
    ) {}

    /** 로그인 사용자 본인의 문의(qna) 글 목록. */
    public function getMine(int $userId): Collection
    {
        return $this->repository->findMineByUser($userId);
    }
}
