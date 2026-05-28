import React from 'react';
import { Div, Section, Ul, Li, Span, P, H2, H3 } from '../basic';
import CountUp from './CountUp';

/**
 * S6 — 한 눈에 본, AICT (At A Glance).
 * 3개 블록: 경영 성과(카드) / 논문·특허+ESG 경영(2-col) / 기술이전·창업(숫자).
 */
const GlanceSection: React.FC = () => {
  return (
    <Section className="section5" aria-labelledby="section5-title">
      <Div className="section5__bg" aria-hidden="true" />
      <Div className="section5__inner">
        {/* Title block */}
        <Div className="section5__header reveal" role="banner">
          <P className="section5__eyebrow">AT A GLANCE</P>
          <H2 id="section5-title" className="section5__title">
            한 눈에 본, AICT
          </H2>
          <P className="section5__lead">
            인간을 향한 융합기술로 편리하고 안전한 사회를 구현하는 전문 연구기관입니다.
          </P>
        </Div>

        {/* Block 1 — 경영 성과 */}
        <Div className="reveal glance glance--cards">
          <Div className="glance__head">
            <H3 className="glance__title">경영 성과</H3>
            <P className="glance__desc">
              외부 평가에서 검증된 최고 등급의 성과로 신뢰받는 연구기관의 길을 이어갑니다.
            </P>
          </Div>
          <Div className="glance__body">
            <Div className="metric-cards">
              <article className="metric-card">
                <Span className="metric-card__tag">Public Evaluation</Span>
                <Div className="metric-card__grade">
                  <Span className="metric-card__grade-value">A</Span>
                  <Span className="metric-card__grade-suffix">등급</Span>
                </Div>
                <P className="metric-card__name">경기도 공공기관 경영평가</P>
                <Ul className="year-pills" role="list">
                  <Li className="year-pill">2022</Li>
                  <Li className="year-pill">2023</Li>
                  <Li className="year-pill">2024</Li>
                  <Li className="year-pill">2025</Li>
                </Ul>
              </article>

              <article className="metric-card">
                <Span className="metric-card__tag">SNU Lab Eval</Span>
                <Div className="metric-card__grade">
                  <Span className="metric-card__grade-value">A1</Span>
                  <Span className="metric-card__grade-suffix">(최우수)등급</Span>
                </Div>
                <P className="metric-card__name">서울대학교 연구소평가</P>
                <Ul className="year-pills" role="list">
                  <Li className="year-pill">2015</Li>
                  <Li className="year-pill">2018</Li>
                  <Li className="year-pill">2021</Li>
                  <Li className="year-pill">2024</Li>
                </Ul>
              </article>
            </Div>
          </Div>
        </Div>

        {/* Block 2 — 논문·특허 + ESG 경영 */}
        <Div className="reveal glance glance--split">
          <Div className="glance-col">
            <H3 className="glance__title">논문 · 특허</H3>
            <P className="glance__desc glance__desc--wide">
              혁신적인 연구 성과를 논문과 특허를 통해 학문과 산업에 확산합니다.
            </P>
            <Div className="number-rows">
              <Div className="number-row">
                <Span className="number-row__label">SCIE급 논문</Span>
                <Span className="number-row__value">
                  <CountUp className="number-row__num" target={1546} format="ko-KR" />
                  <Span className="number-row__unit">건</Span>
                </Span>
              </Div>
              <Div className="number-row">
                <Span className="number-row__label">특허 출원·등록</Span>
                <Span className="number-row__value">
                  <CountUp className="number-row__num" target={422} format="ko-KR" />
                  <Span className="number-row__unit">건</Span>
                </Span>
              </Div>
            </Div>
          </Div>

          <Div className="glance-col">
            <H3 className="glance__title">ESG 경영</H3>
            <P className="glance__desc glance__desc--wide">
              안전한 사업장과 청렴 · 투명한 조직 운영, 지역 사회와의 상생을 통해 사회적 책임을 실현합니다.
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
                  <path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <Span className="esg-badge__top">국제 표준 ISO45001</Span>
                <Span className="esg-badge__bottom">안전보건경영시스템 인증</Span>
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
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <Span className="esg-badge__top">경기 가족친화</Span>
                <Span className="esg-badge__bottom">우수기관 인증</Span>
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
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <Span className="esg-badge__top">소셜아이어워드 연구기관</Span>
                <Span className="esg-badge__bottom">블로그 최우수상</Span>
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <Span className="esg-badge__top">대한민국</Span>
                <Span className="esg-badge__bottom">인터넷소통대상</Span>
              </Li>
            </Ul>
          </Div>
        </Div>

        {/* Block 3 — 기술이전 · 창업 */}
        <Div className="reveal glance glance--numbers">
          <Div className="glance__head">
            <H3 className="glance__title">
              기술이전 및<br />
              연구원 창업
            </H3>
            <P className="glance__desc">
              연구 성과가 시장에 닿도록 기술이전과 창업 지원을 활발히 이어갑니다.
            </P>
          </Div>
          <Div className="glance__body">
            <Div className="number-rows number-rows--two">
              <Div className="number-row">
                <Span className="number-row__label">기술이전</Span>
                <Span className="number-row__value">
                  <CountUp className="number-row__num" target={57} format="plain" />
                  <Span className="number-row__unit">건</Span>
                </Span>
              </Div>
              <Div className="number-row">
                <Span className="number-row__label">연구원 창업</Span>
                <Span className="number-row__value">
                  <CountUp className="number-row__num" target={6} format="plain" />
                  <Span className="number-row__unit">건</Span>
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
