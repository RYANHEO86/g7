import React from 'react';
import { Div, Section, A, Img } from '../basic';
import NoticeTab, { NoticeListItem, NoticeTabDef } from './NoticeTab';

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
    {
      title: '2026년 상반기 디자인·개발 협력사 등록 안내',
      date: '2026-04-15',
      href: '#',
    },
  ],
  press: [
    { title: 'AICT, 미래 모빌리티 산학 협력 협약 체결', date: '2026-05-10', href: '#' },
    { title: '반도체 인재양성 프로그램, 정부 우수사례 선정', date: '2026-05-02', href: '#' },
    { title: '자율주행 시범도시 운영 성과 보고회 개최', date: '2026-04-20', href: '#' },
    { title: '국제 AI 컨소시엄 정식 출범, AICT 의장기관 선임', date: '2026-04-08', href: '#' },
    { title: '오프셋테마, 신규 비즈니스 테마 5종 동시 출시', date: '2026-03-28', href: '#' },
  ],
  hire: [
    { title: '2026 정규직 연구원 채용 최종 합격자 안내', date: '2026-05-09', href: '#' },
    { title: '상반기 행정직 채용 결과 공고', date: '2026-04-25', href: '#' },
    { title: '인턴 연구원 모집 결과 발표', date: '2026-04-12', href: '#' },
    { title: '전문계약직 1차 서류전형 합격자 안내', date: '2026-03-30', href: '#' },
    { title: '2026 하반기 신입 디자이너 채용 서류 합격자 발표', date: '2026-03-18', href: '#' },
  ],
};

/**
 * S4 — 알림장(좌) + 프로모션 배너(우) 2-column.
 * 우측 배너는 4:3 단일 링크 배너 (PC·모바일 동일 비율).
 */
const NoticeArea: React.FC = () => {
  return (
    <Section className="section section2">
      <Div className="aict-layout">
        <Div className="section2-grid">
          {/* LEFT COLUMN */}
          <Div className="section2-left">
            <NoticeTab
              title="알림장"
              moreHref="#"
              moreLabel="알림장 더보기"
              tabs={TABS}
              lists={NOTICE_LISTS}
              defaultTab="notice"
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
                src={`${ASSET_BASE}/main/promo-free-build.png`}
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
