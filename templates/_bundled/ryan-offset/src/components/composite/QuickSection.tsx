import React from 'react';
import { Div, Section, Ul, Li, A, Span, H2 } from '../basic';

/**
 * S2 — Quick access (7 industry shortcut bubbles)
 * 원본 HTML index.html L105-184 의 정적 마크업 1:1 재현.
 */
const QuickSection: React.FC = () => {
  return (
    <Section className="section section-quick" aria-label="적용 업종">
      <Div className="aict-layout">
        <Div className="quick-head" role="banner">
          <Span className="eyebrow">USE CASES</Span>
          <H2 className="quick-head__title">이런 사이트에 잘 어울려요</H2>
        </Div>
        <Ul className="quick-list">
          <Li className="quick-item">
            <A href="#" className="quick-link">
              <Span className="quick-bubble">
                <svg
                  className="quick-ico"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 21h18M5 21V7l7-4 7 4v14" />
                  <path d="M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" />
                </svg>
              </Span>
              <Span className="quick-label">회사 · 기업</Span>
            </A>
          </Li>
          <Li className="quick-item">
            <A href="#" className="quick-link">
              <Span className="quick-bubble">
                <svg
                  className="quick-ico"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </Span>
              <Span className="quick-label">커뮤니티</Span>
            </A>
          </Li>
          <Li className="quick-item">
            <A href="#" className="quick-link">
              <Span className="quick-bubble">
                <svg
                  className="quick-ico"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </Span>
              <Span className="quick-label">포트폴리오</Span>
            </A>
          </Li>
          <Li className="quick-item">
            <A href="#" className="quick-link">
              <Span className="quick-bubble">
                <svg
                  className="quick-ico"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </Span>
              <Span className="quick-label">블로그</Span>
            </A>
          </Li>
          <Li className="quick-item">
            <A href="#" className="quick-link">
              <Span className="quick-bubble">
                <svg
                  className="quick-ico"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9.5" />
                  <circle cx="7.5" cy="10.5" r="1.3" />
                  <circle cx="12" cy="7.5" r="1.3" />
                  <circle cx="16.5" cy="10.5" r="1.3" />
                  <path d="M12 21.5c2 0 3-1.5 3-3 0-1.5-1.5-2-3-2s-3 .5-3 2 1 3 3 3z" />
                </svg>
              </Span>
              <Span className="quick-label">스튜디오 · 에이전시</Span>
            </A>
          </Li>
          <Li className="quick-item">
            <A href="#" className="quick-link">
              <Span className="quick-bubble">
                <svg
                  className="quick-ico"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 2 3 6v2a2 2 0 0 0 4 0v0a2 2 0 0 0 4 0v0a2 2 0 0 0 4 0v0a2 2 0 0 0 4 0V6l-3-4H6z" />
                  <path d="M5 9.5V20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.5" />
                </svg>
              </Span>
              <Span className="quick-label">쇼핑몰</Span>
            </A>
          </Li>
          <Li className="quick-item">
            <A href="#" className="quick-link">
              <Span className="quick-bubble">
                <svg
                  className="quick-ico"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v12a2 2 0 0 0 2 2 2 2 0 0 0 2-2V8h-3" />
                  <path d="M7 8h6M7 12h6M7 16h6" />
                </svg>
              </Span>
              <Span className="quick-label">매거진 · 뉴스</Span>
            </A>
          </Li>
        </Ul>
      </Div>
    </Section>
  );
};

export default QuickSection;
