import React from 'react';
import { Div, Section, Ul, Li, A, Span, P, H2, H3, Img } from '../basic';

const ASSET_BASE =
  '/api/templates/assets/ryan-offset/assets/images/aict';

interface ThemeCard {
  image: string;
  alt: string;
  tag: string;
  price: string;
  title: string;
  desc: string;
  href: string;
}

const CARDS: ThemeCard[] = [
  {
    image: `${ASSET_BASE}/themes/theme-01.jpg`,
    alt: 'Aurora 테마 미리보기',
    tag: 'FINTECH · SAAS',
    price: '₩98,000',
    title: 'Aurora',
    desc: '신뢰감 있는 딥 블루 그라데이션의 핀테크 · SaaS 테마. 카드 모듈과 대시보드 패턴 포함.',
    href: '#',
  },
  {
    image: `${ASSET_BASE}/themes/theme-02.jpg`,
    alt: 'Synapse 테마 미리보기',
    tag: 'AI · PLATFORM',
    price: '₩118,000',
    title: 'Synapse',
    desc: '밝은 화이트 베이스와 디테일이 살아있는 AI 비즈니스 테마. 서비스/지표 섹션 다양하게 준비.',
    href: '#',
  },
  {
    image: `${ASSET_BASE}/themes/theme-03.jpg`,
    alt: 'Horizon 테마 미리보기',
    tag: 'AI · VISION',
    price: '₩128,000',
    title: 'Horizon',
    desc: '보라빛 글로우의 미래지향 다크 테마. AR/VR · 신기술 브랜드에 어울리는 시네마틱 톤.',
    href: '#',
  },
  {
    image: `${ASSET_BASE}/themes/theme-04.jpg`,
    alt: 'Spark 테마 미리보기',
    tag: 'MARKETING · AI',
    price: '₩98,000',
    title: 'Spark',
    desc: '딥 블랙 + 따뜻한 액센트의 마케팅/SEO AI 도구 테마. 입력 UI와 로고 그리드 빌트인.',
    href: '#',
  },
];

const ThemesSection: React.FC = () => {
  return (
    <Section className="section section-themes" aria-label="테마 라인업">
      <Div className="aict-layout">
        <Div className="themes-head" role="banner">
          <Div className="themes-head__left">
            <Span className="eyebrow">THEMES</Span>
            <H2 className="section-tit">완성된 테마 라인업</H2>
          </Div>
          <Div className="themes-head__right">
            <A href="#" className="themes-head__cta">
              전체 테마 보기 <Span aria-hidden="true">→</Span>
            </A>
          </Div>
        </Div>

        <Ul className="themes-grid">
          {CARDS.map((c, i) => (
            <Li key={i} className="theme-card">
              <A href={c.href} className="theme-card__link">
                <Span className="theme-card__media">
                  <Img src={c.image} alt={c.alt} loading="lazy" />
                  <Span className="theme-card__hover" aria-hidden="true">
                    <Span className="theme-card__cta">
                      데모 보기 <em>→</em>
                    </Span>
                  </Span>
                </Span>
                <Div className="theme-card__body">
                  <Div className="theme-card__row">
                    <Span className="theme-card__tag">{c.tag}</Span>
                    <Span className="theme-card__price">{c.price}</Span>
                  </Div>
                  <H3 className="theme-card__title">{c.title}</H3>
                  <P className="theme-card__desc">{c.desc}</P>
                </Div>
              </A>
            </Li>
          ))}
        </Ul>
      </Div>
    </Section>
  );
};

export default ThemesSection;
