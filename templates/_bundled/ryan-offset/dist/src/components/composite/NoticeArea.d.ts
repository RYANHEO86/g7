import { default as React } from 'react';
import { NoticeTabDef } from './NoticeTab';
export interface NoticeAreaItem {
    title: string;
    /** created_at 원본 (예: "2026-05-30 토요일 19:00") — 표시 시 앞 10자만 사용 */
    date: string;
    href: string;
    category: string;
}
export interface NoticeAreaProps {
    /** 탭 정의 — { key, label }. key 가 곧 게시판 category. */
    tabs?: NoticeTabDef[];
    /** notice 게시판 글 목록(단일 배열). category 로 탭 분류한다. (home.json noticePosts → _section_notice 매핑) */
    rows?: NoticeAreaItem[];
    defaultTab?: string;
    moreHref?: string;
}
/**
 * S4 — 알림장(좌, notice 게시판 연동) + 프로모션 배너(우) 2-column.
 * 데이터는 props.rows(단일 배열)로 주입받아 탭 category 별로 분류한다.
 * 우측 배너는 4:3 단일 링크 배너 (PC·모바일 동일 비율).
 */
declare const NoticeArea: React.FC<NoticeAreaProps>;
export default NoticeArea;
