import React from 'react';
import { Div, Section, Ul, Li, A, Span, P, H2, Img } from '../basic';

const ASSET_BASE =
  '/api/templates/assets/ryan-offset/assets/images/aict';

interface Card {
  image: string;
  title: string;
  always?: boolean;
}

const CARDS: Card[] = [
  { image: `${ASSET_BASE}/research/research-card--1.jpg`, title: '미래 모빌리티' },
  { image: `${ASSET_BASE}/research/research-card--2.jpg`, title: '반도체' },
  { image: `${ASSET_BASE}/research/research-card--3.jpg`, title: '지능화 AI 융합' },
  { image: `${ASSET_BASE}/research/research-card--4.jpg`, title: '환경 · 재난안전' },
  { image: `${ASSET_BASE}/research/research-card--5.jpg`, title: '과학문화 확산', always: true },
];

/**
 * S5 — 연구 · 사업 (5-card image grid, 마지막 카드는 항상 타이틀 노출).
 */
const ResearchSection: React.FC = () => {
  return (
    <Section className="section section-research" aria-label="연구 · 사업">
      <Div className="aict-layout">
        <Div className="research-head reveal" role="banner">
          <Div className="research-head__left">
            <Span className="eyebrow">RESEARCH</Span>
            <H2 className="section-tit">연구 · 사업</H2>
          </Div>
          <P className="research-head__desc section-desc">
            최첨단 과학기술을 바탕으로 자율주행·스마트시티·산업자립·보육안전 등
            지역 R&amp;D 중심의 미래지향적 융합연구를 수행하고 있습니다.
          </P>
        </Div>

        <Div className="research-divider" aria-hidden="true" />

        <Ul className="research-cards reveal reveal--delay-1">
          {CARDS.map((c, i) => (
            <Li key={i} className={`rc${c.always ? ' rc--always' : ''}`}>
              <A href="#" className="rc-link" aria-label={c.title}>
                <Span className="rc-media">
                  <Img src={c.image} alt="" loading="lazy" />
                </Span>
                <Span className="rc-overlay" aria-hidden="true" />
                <Span className="rc-title">{c.title}</Span>
              </A>
            </Li>
          ))}
        </Ul>
      </Div>
    </Section>
  );
};

export default ResearchSection;
