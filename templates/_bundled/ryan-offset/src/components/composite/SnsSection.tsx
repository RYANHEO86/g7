import React from 'react';
import { Div, Section, Ul, Li, A, Span, P, H2 } from '../basic';

/**
 * S7 — CTA SNS 섹션 (다크 배경, YouTube/NAVER Blog/Instagram pills).
 * 외부 origin 링크는 native A + target=_blank rel=noopener.
 */
const SnsSection: React.FC = () => {
  return (
    <Section className="section section6" aria-labelledby="section6-title">
      <Div className="section6__bg" aria-hidden="true" />
      <Div className="section6__overlay" aria-hidden="true" />
      <Div className="aict-layout section6__inner">
        <Span className="section6__eyebrow">OFFSET THEME</Span>
        <H2 id="section6-title" className="section6__title">
          <Span className="section6__title-line">완성된 디자인으로</Span>
          <Span className="section6__title-line">시작부터 다르게</Span>
        </H2>
        <P className="section6__subtitle">
          새로운 테마 소식과 제작 이야기를 공식 SNS 채널에서 만나보세요
        </P>

        <Ul className="section6__socials" role="list">
          <Li>
            <A
              className="social-pill"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube 채널 바로가기"
            >
              <Span className="social-pill__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c2 .6 9.4.6 9.4.6s7.4 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
                </svg>
              </Span>
              <Span className="social-pill__label">YouTube</Span>
            </A>
          </Li>
          <Li>
            <A
              className="social-pill"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="네이버 블로그 바로가기"
            >
              <Span
                className="social-pill__icon social-pill__icon--naver"
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="4" ry="4" />
                  <path
                    d="M9 8h2.2l2.6 4.1V8H16v8h-2.2L11.2 11.9V16H9V8z"
                    fill="#FFFFFF"
                  />
                </svg>
              </Span>
              <Span className="social-pill__label">NAVER Blog</Span>
            </A>
          </Li>
          <Li>
            <A
              className="social-pill"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="인스타그램 바로가기"
            >
              <Span
                className="social-pill__icon social-pill__icon--ig"
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <defs>
                    <linearGradient
                      id="igGradient"
                      x1="0%"
                      y1="100%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#F58529" />
                      <stop offset="35%" stopColor="#DD2A7B" />
                      <stop offset="70%" stopColor="#8134AF" />
                      <stop offset="100%" stopColor="#515BD4" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="2.5"
                    y="2.5"
                    width="19"
                    height="19"
                    rx="5"
                    ry="5"
                    fill="none"
                    stroke="url(#igGradient)"
                    strokeWidth={2}
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="4.2"
                    fill="none"
                    stroke="url(#igGradient)"
                    strokeWidth={2}
                  />
                  <circle cx="17.4" cy="6.6" r="1.2" fill="url(#igGradient)" />
                </svg>
              </Span>
              <Span className="social-pill__label">Instagram</Span>
            </A>
          </Li>
        </Ul>
      </Div>
    </Section>
  );
};

export default SnsSection;
