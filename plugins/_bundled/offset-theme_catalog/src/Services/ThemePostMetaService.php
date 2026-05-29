<?php

namespace Plugins\Offset\ThemeCatalog\Services;

use Illuminate\Support\Collection;
use Plugins\Offset\ThemeCatalog\Models\ThemePostMeta;
use Plugins\Offset\ThemeCatalog\Repositories\Contracts\ThemePostMetaRepositoryInterface;

class ThemePostMetaService
{
    /** 게시글 데이터에서 분리해 별도 저장하는 메타 필드. */
    public const META_KEYS = [
        'price', 'license', 'description_short', 'description_long', 'features',
        'changelog', 'demo_url', 'purchase_url', 'download_count', 'last_update',
        'install_note', 'min_requirement', 'rating', 'review_count',
    ];

    public function __construct(
        private ThemePostMetaRepositoryInterface $repository,
    ) {}

    /** 요청 데이터에서 메타 필드만 추출. */
    public function extract(array $data): array
    {
        return array_intersect_key($data, array_flip(self::META_KEYS));
    }

    /** 요청 데이터에서 메타 필드를 제거 (Post 저장용). */
    public function strip(array $data): array
    {
        return array_diff_key($data, array_flip(self::META_KEYS));
    }

    public function save(int $postId, array $meta): void
    {
        if ($meta !== []) {
            $this->repository->upsert($postId, $meta);
        }
    }

    public function delete(int $postId): void
    {
        $this->repository->deleteByPostId($postId);
    }

    public function getByPostId(int $postId): ?ThemePostMeta
    {
        return $this->repository->findByPostId($postId);
    }

    public function getByPostIds(array $postIds): Collection
    {
        return $this->repository->findByPostIds($postIds)->values();
    }

    public function getAllMetas(): Collection
    {
        return $this->repository->all();
    }
}
