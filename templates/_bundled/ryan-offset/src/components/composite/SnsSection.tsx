import React from 'react';
import { Div, Section, H2 } from '../basic';

/**
 * S7 — CTA 타이틀 섹션 (다크 배경).
 */
const SnsSection: React.FC = () => {
  return (
    <Section className="section section6" aria-labelledby="section6-title">
      <Div className="section6__bg" aria-hidden="true" />
      <Div className="section6__overlay" aria-hidden="true" />
      <Div className="aict-layout section6__inner">
        <H2 id="section6-title" className="section6__title">
          <Span className="section6__title-line">완성된 디자인으로</Span>
          <Span className="section6__title-line">시작부터 다르게</Span>
        </H2>
      </Div>
    </Section>
  );
};

export default SnsSection;
