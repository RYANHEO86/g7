import React from 'react';
import { Div, Section, Ul, Li, Span, P, H2, H3 } from '../basic';
import CountUp from './CountUp';

/**
 * S6 — 왜 오프셋테마인가 (At A Glance 재기획).
 * 3개 블록: 제품 강점(카드) / 검증된 품질 + 안심 정책(2-col) / 제작 프로세스(숫자).
 * 기존 section5 / glance / metric-card / number-rows / esg-grid 클래스 재활용.
 */
const GlanceSection: React.FC = () => {
  return (
    <Section className="section5" aria-labelledby="section5-title">
      <Div className="section5__bg" aria-hidden="true" />
      <Div className="section5__inner">
        {/* Title block */}
        <Div className="section5__header reveal" role="banner">
          <P className="section5__eyebrow">WHY OFFSET</P>
          <H2 id="section5-title" className="section5__title">
            왜 오프셋테마인가
          </H2>
          <P className="section5__lead">
            디테일까지 완성된 프리미엄 테마로, 더 빠르고 더 멋진 웹사이트를 시작하세요.
          </P>
        </Div>

        {/* Block 1 — 제품 강점 */}
        <Div className="reveal glance glance--cards">
          <Div className="glance__head">
            <H3 className="glance__title">제품의 기준</H3>
            <P className="glance__desc">
              모든 오프셋테마는 아래 4가지 기준을 충족한 뒤에야 출시됩니다.
            </P>
          </Div>
          <Div className="glance__body">
            <Div className="metric-cards">
              <article className="metric-card">
                <Span className="metric-card__tag">Responsive</Span>
                <Div className="metric-card__grade">
                  <Span className="metric-card__grade-value">100</Span>
                  <Span className="metric-card__grade-suffix">% 반응형</Span>
                </Div>
                <P className="metric-card__name">모바일·태블릿·데스크톱 완벽 대응</P>
                <Ul className="year-pills" role="list">
                  <Li className="year-pill">Mobile</Li>
                  <Li className="year-pill">Tablet</Li>
                  <Li className="year-pill">Desktop</Li>
                </Ul>
              </article>

              <article className="metric-card">
                <Span className="metric-card__tag">Performance</Span>
                <Div className="metric-card__grade">
                  <Span className="metric-card__grade-value">A+</Span>
                  <Span className="metric-card__grade-suffix">속도 등급</Span>
                </Div>
                <P className="metric-card__name">가볍고 빠른 로딩 · Core Web Vitals 최적화</P>
                <Ul className="year-pills" role="list">
                  <Li className="year-pill">SEO</Li>
                  <Li className="year-pill">접근성</Li>
                  <Li className="year-pill">크로스브라우저</Li>
                </Ul>
              </article>
            </Div>
          </Div>
        </Div>

        {/* Block 2 — 검증된 품질 + 안심 정책 */}
        <Div className="reveal glance glance--split">
          <Div className="glance-col">
            <H3 className="glance__title">검증된 품질</H3>
            <P className="glance__desc glance__desc--wide">
              많은 고객이 선택하고 다시 찾는 테마로 그 완성도를 증명합니다.
            </P>
            <Div className="number-rows">
              <Div className="number-row">
                <Span className="number-row__label">누적 다운로드</Span>
                <Span className="number-row__value">
                  <CountUp className="number-row__num" target={12800} format="ko-KR" />
                  <Span className="number-row__unit">+</Span>
                </Span>
              </Div>
              <Div className="number-row">
                <Span className="number-row__label">평균 만족도</Span>
                <Span className="number-row__value">
                  <Span className="number-row__num">4.9</Span>
                  <Span className="number-row__unit">/ 5.0</Span>
                </Span>
              </Div>
            </Div>
          </Div>

          <Div className="glance-col">
            <H3 className="glance__title">안심 정책</H3>
            <P className="glance__desc glance__desc--wide">
              구매 이후가 더 든든하도록, 사용 전 과정을 책임지고 지원합니다.
            </P>
            <Ul className="esg-grid" role="list">
              <Li className="esg-badge">
                <svg
                  className="esg-badge__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
                <Span className="esg-badge__top">평생 무료</Span>
                <Span className="esg-badge__bottom">업데이트 지원</Span>
              </Li>
              <Li className="esg-badge">
                <svg
                  className="esg-badge__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14 9V5a3 3 0 0 0-6 0v4" />
                  <path d="M21 8H3l1 12h16l1-12z" />
                </svg>
                <Span className="esg-badge__top">1:1 기술</Span>
                <Span className="esg-badge__bottom">설치·사용 지원</Span>
              </Li>
              <Li className="esg-badge">
                <svg
                  className="esg-badge__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <Span className="esg-badge__top">명확한</Span>
                <Span className="esg-badge__bottom">상업용 라이선스</Span>
              </Li>
              <Li className="esg-badge">
                <svg
                  className="esg-badge__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 3v18h18" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
                <Span className="esg-badge__top">7일 이내</Span>
                <Span className="esg-badge__bottom">환불 보장</Span>
              </Li>
            </Ul>
          </Div>
        </Div>

        {/* Block 3 — 제작 프로세스 */}
        <Div className="reveal glance glance--numbers">
          <Div className="glance__head">
            <H3 className="glance__title">
              맞춤 제작도
              <br />
              한 흐름으로
            </H3>
            <P className="glance__desc">
              기성 테마로 부족하다면, 의뢰부터 납품까지 명확한 4단계로 진행합니다.
            </P>
          </Div>
          <Div className="glance__body">
            <Div className="number-rows number-rows--two">
              <Div className="number-row">
                <Span className="number-row__label">평균 제작 기간</Span>
                <Span className="number-row__value">
                  <CountUp className="number-row__num" target={14} format="plain" />
                  <Span className="number-row__unit">일~</Span>
                </Span>
              </Div>
              <Div className="number-row">
                <Span className="number-row__label">진행 단계</Span>
                <Span className="number-row__value">
                  <CountUp className="number-row__num" target={4} format="plain" />
                  <Span className="number-row__unit">단계</Span>
                </Span>
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>
    </Section>
  );
};

export default GlanceSection;
