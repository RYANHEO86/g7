<?php

namespace Plugins\Offset\ThemeCatalog\Listeners;

use App\Contracts\Extension\HookListenerInterface;
use Plugins\Offset\ThemeCatalog\Services\ThemePostMetaService;

/**
 * theme 게시판 게시글의 카탈로그 메타를 hook 으로 저장/검증한다.
 * filter_create_data 에서 메타를 추출(세션 임시 보관)하고 Post 데이터에서 제거,
 * after_create 에서 별도 테이블에 저장. (sirsoft-board UserNotificationSettingsListener 패턴)
 */
class ThemeMetaListener implements HookListenerInterface
{
    private const SESSION_KEY = 'offset_theme_catalog.pending_meta';
    private const SLUG = 'theme';

    public function __construct(
        private ThemePostMetaService $service,
    ) {}

    /** HookListenerInterface 요구 — 모든 hook 에 method 를 명시하므로 미사용. */
    public function handle(...$args): void
    {
    }

    public static function getSubscribedHooks(): array
    {
        return [
            'sirsoft-board.post.filter_create_data' => ['method' => 'filterCreateData', 'priority' => 10, 'type' => 'filter'],
            'sirsoft-board.post.filter_update_data' => ['method' => 'filterUpdateData', 'priority' => 10, 'type' => 'filter'],
            'sirsoft-board.post.after_create' => ['method' => 'afterCreate', 'priority' => 10],
            'sirsoft-board.post.after_update' => ['method' => 'afterUpdate', 'priority' => 10],
            'sirsoft-board.post.after_delete' => ['method' => 'afterDelete', 'priority' => 10],
            'sirsoft-board.post.store_validation_rules' => ['method' => 'validationRules', 'priority' => 10, 'type' => 'filter'],
            'sirsoft-board.post.update_validation_rules' => ['method' => 'validationRules', 'priority' => 10, 'type' => 'filter'],
        ];
    }

    public function filterCreateData(array $data, string $slug): array
    {
        if ($slug !== self::SLUG) {
            return $data;
        }
        session([self::SESSION_KEY => $this->service->extract($data)]);

        return $this->service->strip($data);
    }

    public function filterUpdateData(array $data, $post, string $slug): array
    {
        if ($slug !== self::SLUG) {
            return $data;
        }
        session([self::SESSION_KEY => $this->service->extract($data)]);

        return $this->service->strip($data);
    }

    public function afterCreate($post, string $slug, array $options): void
    {
        $this->persistPendingMeta($post, $slug);
    }

    public function afterUpdate($post, string $slug, array $snapshot): void
    {
        $this->persistPendingMeta($post, $slug);
    }

    public function afterDelete($post, string $slug, array $options): void
    {
        if ($slug !== self::SLUG) {
            return;
        }
        $this->service->delete((int) $post->id);
    }

    /**
     * store/update_validation_rules 는 ($rules, $request) 로 호출된다(slug 인자 없음).
     * 메타 필드는 모두 nullable 이라 비-theme 게시판에 붙어도 무해하다.
     */
    public function validationRules(array $rules): array
    {
        return array_merge($rules, [
            'price' => ['nullable', 'string', 'max:50'],
            'license' => ['nullable', 'string', 'max:100'],
            'description_short' => ['nullable', 'string', 'max:255'],
            'description_long' => ['nullable', 'string'],
            'features' => ['nullable', 'array'],
            'changelog' => ['nullable', 'string'],
            'demo_url' => ['nullable', 'string', 'max:500'],
            'purchase_url' => ['nullable', 'string', 'max:500'],
            'download_count' => ['nullable', 'integer'],
            'last_update' => ['nullable', 'string', 'max:50'],
            'install_note' => ['nullable', 'string'],
            'min_requirement' => ['nullable', 'string', 'max:255'],
            'rating' => ['nullable', 'string', 'max:10'],
            'review_count' => ['nullable', 'integer'],
        ]);
    }

    private function persistPendingMeta($post, string $slug): void
    {
        if ($slug !== self::SLUG) {
            return;
        }
        $meta = session(self::SESSION_KEY, []);
        session()->forget(self::SESSION_KEY);
        $this->service->save((int) $post->id, $meta);
    }
}
