import React from 'react';
import { Div, Section, Ul, Li, A, Span, P, H2, H3 } from '../basic';

/* ============================================================
   소개(/about) — 브랜드 철학 + 밸류 + 제공 내역 + 기준 + CTA
   정적 콘텐츠, ryan-offset 톤.
   ============================================================ */

interface ValueItem {
  no: string;
  title: string;
  desc: string;
}

const VALUES: ValueItem[] = [
  {
    no: '01',
    title: '덜어낸 디자인',
    desc: '꼭 필요한 것만 남깁니다. 과한 장식 대신 콘텐츠가 돋보이는 절제된 화면을 설계합니다.',
  },
  {
    no: '02',
    title: '단단한 코드',
    desc: '반응형·성능·접근성을 기본값으로. 오래 써도 흔들리지 않는 구조로 만듭니다.',
  },
  {
    no: '03',
    title: '실전의 균형',
    desc: '예쁘기만 한 테마가 아니라, 실제 운영에서 바로 쓰이는 완성형을 지향합니다.',
  },
];

interface OfferItem {
  name: string;
  desc: string;
}

const OFFERS: OfferItem[] = [
  { name: '테마 구매', desc: '완성된 테마를 바로 받아 직접 설치' },
  { name: '베이직', desc: '설치·도메인·메인 세팅까지 대행' },
  { name: '플러스', desc: '맞춤 이미지·문구 + 커스텀 8종' },
  { name: '프리미엄', desc: '기능 개발까지, 플랫폼 수준 구축' },
];

const STANDARDS: string[] = [
  '모바일·태블릿·데스크톱 100% 반응형',
  '가볍고 빠른 로딩 · Core Web Vitals 최적화',
  'SEO 기본 세팅 내장',
  '현재 리빌더(Rebuilder) 전용 · 빌더 확대 예정',
];

const AboutSection: React.FC = () => {
  return (
    <Section className="section about" aria-label="오프셋테마 소개">
      <Div className="aict-layout">
        {/* 브랜드 철학 */}
        <Div className="about-hero reveal">
          <Span className="about-hero__eyebrow">OFFSET THEME</Span>
          <P className="about-hero__lead">
            덜어내야 할 것을 아는 디자인과, 단단히 남겨야 할 것을 아는 코드.
            <br />
            오프셋은 그 사이의 <em>균형</em>을 설계합니다.
          </P>
        </Div>

        {/* 밸류 3 */}
        <Ul className="about-values reveal">
          {VALUES.map((v) => (
            <Li key={v.no} className="about-value">
              <Span className="about-value__no">{v.no}</Span>
              <H3 className="about-value__title">{v.title}</H3>
              <P className="about-value__desc">{v.desc}</P>
            </Li>
          ))}
        </Ul>

        {/* 우리가 제공하는 것 */}
        <Div className="about-block reveal">
          <Div className="about-block__head">
            <H2 className="about-block__title">우리가 제공하는 것</H2>
            <P className="about-block__desc">
              직접 설치부터 플랫폼 구축까지, 필요한 만큼 단계별로 함께합니다.
            </P>
          </Div>
          <Ul className="about-offers">
            {OFFERS.map((o, i) => (
              <Li key={i} className="about-offer">
                <H3 className="about-offer__name">{o.name}</H3>
                <P className="about-offer__desc">{o.desc}</P>
              </Li>
            ))}
          </Ul>
          <A href="/pricing" className="about-block__link">
            플랜·가격 자세히 보기 <Span aria-hidden="true">→</Span>
          </A>
        </Div>

        {/* 오프셋테마의 기준 */}
        <Div className="about-block about-block--standards reveal">
          <Div className="about-block__head">
            <H2 className="about-block__title">오프셋테마의 기준</H2>
            <P className="about-block__desc">모든 테마는 아래 기준을 충족한 뒤에야 출시됩니다.</P>
          </Div>
          <Ul className="about-standards">
            {STANDARDS.map((s, i) => (
              <Li key={i} className="about-standard">
                <Span className="about-standard__check" aria-hidden="true">
                  ✓
                </Span>
                {s}
              </Li>
            ))}
          </Ul>
        </Div>

        {/* CTA */}
        <Div className="about-cta reveal">
          <H2 className="about-cta__title">완성된 디자인으로, 시작부터 다르게.</H2>
          <Div className="about-cta__actions">
            <A href="/board/theme" className="about-cta__btn about-cta__btn--primary">
              테마 둘러보기 <Span aria-hidden="true">→</Span>
            </A>
            <A href="/contact" className="about-cta__btn about-cta__btn--ghost">
              문의하기
            </A>
          </Div>
        </Div>
      </Div>
    </Section>
  );
};

export default AboutSection;
