<?php

namespace Plugins\Offset\ThemeCatalog\Repositories;

use Illuminate\Support\Collection;
use Plugins\Offset\ThemeCatalog\Models\ThemePostMeta;
use Plugins\Offset\ThemeCatalog\Repositories\Contracts\ThemePostMetaRepositoryInterface;

class ThemePostMetaRepository implements ThemePostMetaRepositoryInterface
{
    public function findByPostId(int $postId): ?ThemePostMeta
    {
        return ThemePostMeta::where('post_id', $postId)->first();
    }

    public function findByPostIds(array $postIds): Collection
    {
        return ThemePostMeta::whereIn('post_id', $postIds)->get()->keyBy('post_id');
    }

    public function all(): Collection
    {
        return ThemePostMeta::all();
    }

    public function upsert(int $postId, array $data): ThemePostMeta
    {
        $meta = ThemePostMeta::firstOrNew(['post_id' => $postId]);
        $meta->fill($data)->save();

        return $meta->fresh();
    }

    public function deleteByPostId(int $postId): void
    {
        ThemePostMeta::where('post_id', $postId)->delete();
    }
}
