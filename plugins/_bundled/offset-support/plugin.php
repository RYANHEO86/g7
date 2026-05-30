<?php

namespace Plugins\Offset\Support;

use App\Extension\AbstractPlugin;
use Modules\Sirsoft\Board\Models\Board;
use Modules\Sirsoft\Board\Services\BoardService;

class Plugin extends AbstractPlugin
{
    /**
     * 설치 시 게시판을 멱등 생성한다.
     * - qna(문의): secret_mode=always(항상 비밀글, 서버가 is_secret 강제), 본인+관리자만 열람
     * - notice(공지): 공개 읽기 + 관리자만 작성, 카테고리 3종(공지사항/업데이트/이벤트). 메인 알림장과 연동.
     */
    public function install(): bool
    {
        /** @var BoardService $boards */
        $boards = app(BoardService::class);

        // qna(1:1 문의) — 멱등: 있으면 secret_mode 보정, 없으면 생성
        $qna = Board::where('slug', 'qna')->first();
        if ($qna) {
            if (($qna->secret_mode->value ?? null) !== 'always') {
                $boards->updateBoard($qna->id, ['secret_mode' => 'always']);
            }
        } else {
            $boards->createBoard([
                'name'               => ['ko' => '문의', 'en' => 'Support'],
                'slug'               => 'qna',
                'description'        => ['ko' => '궁금한 점을 1:1로 문의하세요 (작성자 본인만 열람).', 'en' => 'Ask privately.'],
                'type'               => 'basic',
                'is_active'          => true,
                'secret_mode'        => 'always',
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
        }

        // notice(공지) — 공개 읽기, 관리자만 작성. 메인 알림장(NoticeArea)과 연동.
        if (! Board::where('slug', 'notice')->exists()) {
            $boards->createBoard([
                'name'               => ['ko' => '공지', 'en' => 'Notice'],
                'slug'               => 'notice',
                'description'        => ['ko' => '오프셋테마 소식과 업데이트를 알려드립니다.', 'en' => 'News & updates.'],
                'type'               => 'basic',
                'is_active'          => true,
                'secret_mode'        => 'disabled',
                'use_comment'        => false,
                'use_reply'          => false,
                'use_report'         => false,
                'use_file_upload'    => true,
                'max_file_size'      => 5242880,
                'max_file_count'     => 3,
                'allowed_extensions' => ['jpg', 'jpeg', 'png', 'pdf'],
                'show_view_count'    => true,
                'per_page'           => 20,
                'categories'         => ['공지사항', '업데이트', '이벤트'],
                'notify_admin_on_post' => false,
                // 누구나 읽기(posts_read 미정의), 관리자만 작성
                'permissions' => [
                    'posts_write' => ['roles' => ['admin']],
                ],
            ]);
        }

        return true;
    }
}
