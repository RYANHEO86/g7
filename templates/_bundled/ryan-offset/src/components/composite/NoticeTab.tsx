import React, { useState } from 'react';
import { Div, H2, Button, A, Ul, Li, Span } from '../basic';

export interface NoticeListItem {
  title: string;
  /** ISO/유사 형식 (예: '2026-05-15') */
  date: string;
  href: string;
}

export interface NoticeTabDef {
  key: string;
  label: string;
}

export interface NoticeTabProps {
  title?: string;
  /** 더보기 링크 — undefined면 + 버튼 비표시 */
  moreHref?: string;
  /** 더보기 aria-label */
  moreLabel?: string;
  tabs: NoticeTabDef[];
  /** 각 탭 key별 리스트 데이터 */
  lists: Record<string, NoticeListItem[]>;
  /** 기본 활성 탭 — 미지정 시 첫 번째 탭 */
  defaultTab?: string;
  className?: string;
}

const EMPTY_TABS: NoticeTabDef[] = [];
const EMPTY_LISTS: Record<string, NoticeListItem[]> = {};

/**
 * S4 알림마당 — 공지/보도/채용 탭 카드.
 * aria-selected 토글, hidden 속성으로 비활성 리스트 처리.
 */
const NoticeTab: React.FC<NoticeTabProps> = ({
  title = '알림마당',
  moreHref,
  moreLabel,
  tabs = EMPTY_TABS,
  lists = EMPTY_LISTS,
  defaultTab,
  className = '',
}) => {
  const initialKey = defaultTab ?? tabs[0]?.key ?? '';
  const [active, setActive] = useState(initialKey);

  const composed = ['notice-card', className].filter(Boolean).join(' ');

  return (
    <Div className={composed}>
      <Div className="notice-card__head">
        <H2 className="notice-card__title">{title}</H2>
        {moreHref && (
          <A
            href={moreHref}
            className="more-btn"
            aria-label={moreLabel ?? `${title} 더보기`}
          >
            <Span className="more-btn__plus" aria-hidden="true">
              +
            </Span>
          </A>
        )}
      </Div>

      <Div className="notice-tabs" role="tablist">
        {tabs.map((t) => (
          <Button
            key={t.key}
            type="button"
            className={`notice-tab${active === t.key ? ' active' : ''}`}
            data-tab={t.key}
            role="tab"
            aria-selected={active === t.key}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </Button>
        ))}
      </Div>

      {tabs.map((t) => {
        const items = lists[t.key] ?? [];
        const isActive = active === t.key;
        return (
          <Ul
            key={t.key}
            className="notice-list"
            data-list={t.key}
            hidden={!isActive}
          >
            {items.map((it, i) => (
              <Li key={i} className="notice-row">
                <A href={it.href} className="notice-row__link">
                  <Span className="notice-row__title">{it.title}</Span>
                  <Span className="notice-row__date">{it.date}</Span>
                </A>
              </Li>
            ))}
          </Ul>
        );
      })}
    </Div>
  );
};

export default NoticeTab;
