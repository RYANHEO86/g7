import React from 'react';
import { Div, Section, A, Img } from '../basic';
import NoticeTab, { NoticeListItem, NoticeTabDef } from './NoticeTab';

const ASSET_BASE =
  '/api/templates/assets/ryan-offset/assets/images/aict';

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

const EMPTY_TABS: NoticeTabDef[] = [];
const EMPTY_ITEMS: NoticeAreaItem[] = [];

/**
 * S4 — 알림장(좌, notice 게시판 연동) + 프로모션 배너(우) 2-column.
 * 데이터는 props.rows(단일 배열)로 주입받아 탭 category 별로 분류한다.
 * 우측 배너는 4:3 단일 링크 배너 (PC·모바일 동일 비율).
 */
const NoticeArea: React.FC<NoticeAreaProps> = ({
  tabs = EMPTY_TABS,
  rows = EMPTY_ITEMS,
  defaultTab,
  moreHref = '/board/notice',
}) => {
  // 카테고리(탭 key)별 분류 + 날짜는 앞 10자(YYYY-MM-DD)만
  const lists: Record<string, NoticeListItem[]> = {};
  tabs.forEach((t) => {
    lists[t.key] = rows
      .filter((it) => it.category === t.key)
      .map((it) => ({ title: it.title, date: (it.date ?? '').slice(0, 10), href: it.href }));
  });

  return (
    <Section className="section section2">
      <Div className="aict-layout">
        <Div className="section2-grid">
          {/* LEFT COLUMN — 알림장 (notice 게시판 연동) */}
          <Div className="section2-left">
            <NoticeTab
              title="알림장"
              moreHref={moreHref}
              moreLabel="알림장 더보기"
              tabs={tabs}
              lists={lists}
              defaultTab={defaultTab ?? tabs[0]?.key}
              className="reveal"
            />
          </Div>

          {/* RIGHT COLUMN — 프로모션 배너 (4:3, 링크 일단 #) */}
          <Div className="section2-right">
            <A
              href="#"
              className="promo-banner reveal reveal--delay-1"
              aria-label="선착순 5명 무료 제작 지원 — 지금 무료 신청"
            >
              <Img
                src={`${ASSET_BASE}/main/promo-free-build.webp`}
                alt="OFFSET THEME 오픈 기념 — 선착순 5명 무료 제작 지원. 30만원 상당 웹사이트 제작, 테마 설치부터 메인페이지 세팅까지. 2026.6.30까지 잔여 5명."
              />
            </A>
          </Div>
        </Div>
      </Div>
    </Section>
  );
};

export default NoticeArea;
