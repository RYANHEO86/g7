<?php

namespace Plugins\Offset\Support\Repositories;

use Illuminate\Support\Collection;
use Modules\Sirsoft\Board\Models\Board;
use Modules\Sirsoft\Board\Models\Post;
use Plugins\Offset\Support\Repositories\Contracts\QuestionRepositoryInterface;

class QuestionRepository implements QuestionRepositoryInterface
{
    public function findMineByUser(int $userId, int $limit = 50): Collection
    {
        $boardId = Board::where('slug', 'qna')->value('id');
        if (! $boardId) {
            return collect();
        }

        return Post::where('board_id', $boardId)
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }
}
