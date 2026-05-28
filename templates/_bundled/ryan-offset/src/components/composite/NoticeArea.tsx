import React from 'react';
import { Div, Section, Ul, Li, A, Span, H3, Img } from '../basic';
import NoticeTab, { NoticeListItem, NoticeTabDef } from './NoticeTab';
import PopupSlider, { PopupSlideItem } from './PopupSlider';

const ASSET_BASE =
  '/api/templates/assets/ryan-offset/assets/images/aict';

const TABS: NoticeTabDef[] = [
  { key: 'notice', label: '공지사항' },
  { key: 'press', label: '보도자료' },
  { key: 'hire', label: '채용결과' },
];

const NOTICE_LISTS: Record<string, NoticeListItem[]> = {
  notice: [
    {
      title:
        '2026년 제1회 미래교육 공동포럼 "인공지능(AI) 시대의 미래교육: AI 시대, 새로운 학교를 말하다"',
      date: '2026-05-15',
      href: '#',
    },
    {
      title: '2026 경기도미래모빌리티센터 신규 입주기업 모집 공고',
      date: '2026-05-12',
      href: '#',
    },
    {
      title: '26년 제2회 학부모와 함께하는 반도체 교실 참여자 모집 공고',
      date: '2026-05-08',
      href: '#',
    },
    {
      title: '2026 경기도 Pre-Poc 시장 실증 및 사업화 연계 전략',
      date: '2026-04-23',
      href: '#',
    },
  ],
  press: [
    { title: 'AICT, 미래 모빌리티 산학 협력 협약 체결', date: '2026-05-10', href: '#' },
    { title: '반도체 인재양성 프로그램, 정부 우수사례 선정', date: '2026-05-02', href: '#' },
    { title: '자율주행 시범도시 운영 성과 보고회 개최', date: '2026-04-20', href: '#' },
    { title: '국제 AI 컨소시엄 정식 출범, AICT 의장기관 선임', date: '2026-04-08', href: '#' },
  ],
  hire: [
    { title: '2026 정규직 연구원 채용 최종 합격자 안내', date: '2026-05-09', href: '#' },
    { title: '상반기 행정직 채용 결과 공고', date: '2026-04-25', href: '#' },
    { title: '인턴 연구원 모집 결과 발표', date: '2026-04-12', href: '#' },
    { title: '전문계약직 1차 서류전형 합격자 안내', date: '2026-03-30', href: '#' },
  ],
};

interface TrendItem {
  image: string;
  alt: string;
  title: string;
  date: string;
  href: string;
}

const TRENDS: TrendItem[] = [
  {
    image: `${ASSET_BASE}/news/news1.jpg`,
    alt: '2026년 청렴 리더 워크숍',
    title: '2026년 청렴 리더 워크숍',
    date: '2026-05-07',
    href: '#',
  },
  {
    image: `${ASSET_BASE}/news/news2.jpg`,
    alt: '어린이날 기념 주경기장 부스 운영',
    title: '어린이날 기념 주경기장 부스 운영',
    date: '2026-05-07',
    href: '#',
  },
  {
    image: `${ASSET_BASE}/news/news3.jpg`,
    alt: '지역사회 상생 협력 사회공헌 활동',
    title: '지역사회 상생 협력 사회공헌 활동',
    date: '2026-04-15',
    href: '#',
  },
];

const POSTERS: PopupSlideItem[] = [
  { image: `${ASSET_BASE}/popup/poster1.jpg`, alt: '포스터 1' },
  { image: `${ASSET_BASE}/popup/poster2.png`, alt: '포스터 2' },
  { image: `${ASSET_BASE}/popup/poster3.png`, alt: '포스터 3' },
];

/**
 * S4 — 알림마당 + 융기원 동향 + 발간물 + POPUP ZONE 영역.
 * 2-column grid (section2-left / section2-right).
 */
const NoticeArea: React.FC = () => {
  return (
    <Section className="section section2">
      <Div className="aict-layout">
        <Div className="section2-grid">
          {/* LEFT COLUMN */}
          <Div className="section2-left">
            <NoticeTab
              title="알림마당"
              moreHref="#"
              moreLabel="알림마당 더보기"
              tabs={TABS}
              lists={NOTICE_LISTS}
              defaultTab="notice"
              className="reveal"
            />

            <Div className="trend-card reveal reveal--delay-1">
              <Div className="trend-card__head">
                <H3 className="trend-card__title">융기원 동향</H3>
                <A href="#" className="more-btn" aria-label="융기원 동향 더보기">
                  <Span className="more-btn__plus" aria-hidden="true">
                    +
                  </Span>
                </A>
              </Div>
              <Ul className="trend-list">
                {TRENDS.map((t, i) => (
                  <Li key={i} className="trend-item">
                    <A href={t.href} className="trend-item__link">
                      <Span className="trend-item__thumb">
                        <Img src={t.image} alt={t.alt} loading="lazy" />
                      </Span>
                      <Span className="trend-item__title">{t.title}</Span>
                      <Span className="trend-item__date">{t.date}</Span>
                    </A>
                  </Li>
                ))}
              </Ul>
            </Div>
          </Div>

          {/* RIGHT COLUMN */}
          <Div className="section2-right">
            <A href="#" className="publication-card reveal">
              <Span className="publication-card__pattern" aria-hidden="true" />
              <Span className="publication-card__inner">
                <Span className="publication-card__label">발간물</Span>
                <Span className="publication-card__title">2025 영문 브로슈어</Span>
                <Span className="publication-card__meta">관리자 | 2025-11-25</Span>
              </Span>
              <Span className="publication-card__arrow" aria-hidden="true">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="#1A1A1A"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Span>
            </A>

            <PopupSlider posters={POSTERS} className="reveal reveal--delay-1" />
          </Div>
        </Div>
      </Div>
    </Section>
  );
};

export default NoticeArea;
