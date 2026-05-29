<?php

namespace Plugins\Offset\ThemeCatalog\Repositories\Contracts;

use Illuminate\Support\Collection;
use Plugins\Offset\ThemeCatalog\Models\ThemePostMeta;

interface ThemePostMetaRepositoryInterface
{
    public function findByPostId(int $postId): ?ThemePostMeta;

    public function findByPostIds(array $postIds): Collection;

    public function all(): Collection;

    public function upsert(int $postId, array $data): ThemePostMeta;

    public function deleteByPostId(int $postId): void;
}
