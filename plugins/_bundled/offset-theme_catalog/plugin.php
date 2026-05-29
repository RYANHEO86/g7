<?php

namespace Plugins\Offset\ThemeCatalog;

use App\Extension\AbstractPlugin;

class Plugin extends AbstractPlugin
{
    /**
     * 훅 리스너 목록 반환.
     * (ThemeMetaListener 는 Task 4 에서 추가)
     *
     * @return array
     */
    public function getHookListeners(): array
    {
        return [];
    }

    /**
     * 동적 생성 테이블 — 언인스톨 시 Manager 가 삭제.
     *
     * @return array
     */
    public function getDynamicTables(): array
    {
        return ['theme_post_metas'];
    }
}
