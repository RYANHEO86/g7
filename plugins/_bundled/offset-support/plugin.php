<?php

namespace Plugins\Offset\Support;

use App\Extension\AbstractPlugin;
use Modules\Sirsoft\Board\Models\Board;
use Modules\Sirsoft\Board\Services\BoardService;

class Plugin extends AbstractPlugin
{
    /**
     * 설치 시 qna(문의) 게시판을 멱등 생성한다.
     * secret_mode=enabled, 본인+관리자만 비밀글 열람, 카테고리 4종.
     */
    public function install(): bool
    {
        if (Board::where('slug', 'qna')->exists()) {
            return true;
        }

        /** @var BoardService $boards */
        $boards = app(BoardService::class);
        $boards->createBoard([
            'name'               => ['ko' => '문의', 'en' => 'Support'],
            'slug'               => 'qna',
            'description'        => ['ko' => '궁금한 점을 1:1로 문의하세요 (작성자 본인만 열람).', 'en' => 'Ask privately.'],
            'type'               => 'basic',
            'is_active'          => true,
            'secret_mode'        => 'enabled',
            'use_comment'        => true,
            'use_reply'          => true,
            'max_reply_depth'    => 3,
            'use_report'         => false,
            'use_file_upload'    => true,
            'max_file_size'      => 5242880,
            'max_file_count'     => 3,
            'allowed_extensions' => ['jpg', 'jpeg', 'png', 'pdf', 'zip', 'txt'],
            'show_view_count'    => true,
            'per_page'           => 20,
            'categories'         => ['일반문의', '구매·결제', '셋팅·제작', '기타'],
            'notify_admin_on_post' => true,
            // 비밀글은 작성자 본인 + 관리자만 열람 (다른 회원 노출 방지)
            'permissions' => [
                'posts_read-secret' => ['roles' => ['admin']],
            ],
        ]);

        return true;
    }
}
