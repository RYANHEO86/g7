import React, { useEffect, useRef, useState } from 'react';
import { Div, Ul, Li, A, Span, P, Img, Nav, Button } from '../basic';

const ASSET_BASE =
  '/api/templates/assets/ryan-offset/assets/images/aict';

const RELATED_SITES = [
  { label: '그누보드', href: 'https://sir.kr/' },
  { label: '리빌더', href: 'https://rebuilder.co.kr/' },
];

/**
 * AICT 스타일 푸터 (오프셋 테마 메인 페이지 전용).
 * Band1 관련사이트 + Band2 정책 메뉴 + Band3 회사 정보 + 인증 마크.
 */
const AictFooter: React.FC = () => {
  const [relatedOpen, setRelatedOpen] = useState(false);
  const relatedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!relatedOpen) return;
    const handlePointer = (e: MouseEvent) => {
      if (relatedRef.current && !relatedRef.current.contains(e.target as Node)) {
        setRelatedOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setRelatedOpen(false);
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [relatedOpen]);

  return (
    <Div className="site-footer" role="contentinfo">
      <Div className="aict-layout site-footer__inner">
        {/* Band 1 — Related */}
        <Div className="footer-band footer-band--related">
          <Div className="related-dropdown" ref={relatedRef}>
            <Button
              type="button"
              className="related-btn"
              aria-haspopup="true"
              aria-expanded={relatedOpen}
              onClick={() => setRelatedOpen((v) => !v)}
            >
              <Span>관련 사이트</Span>
              <Span
                className={`related-btn__icon${relatedOpen ? ' related-btn__icon--open' : ''}`}
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </Span>
            </Button>
            {relatedOpen && (
              <Ul className="related-menu" role="menu">
                {RELATED_SITES.map((site) => (
                  <Li key={site.href} role="none">
                    <A
                      className="related-menu__link"
                      role="menuitem"
                      href={site.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {site.label}
                    </A>
                  </Li>
                ))}
              </Ul>
            )}
          </Div>
        </Div>

        {/* Band 2 — Policy */}
        <Nav
          className="footer-band footer-band--policy"
          aria-label="이용약관 및 정책"
        >
          <Ul className="policy-list" role="list">
            <Li>
              <A className="policy-link policy-link--strong" href="#">
                개인정보처리방침
              </A>
            </Li>
            <Li>
              <A className="policy-link" href="#">
                영상정보처리기기 운영·관리 방침
              </A>
            </Li>
            <Li>
              <A className="policy-link" href="#">
                이메일주소무단수집거부
              </A>
            </Li>
            <Li>
              <A className="policy-link" href="#">
                메일링 서비스
              </A>
            </Li>
            <Li>
              <A className="policy-link" href="#">
                찾아오시는 길
              </A>
            </Li>
            <Li>
              <A className="policy-link" href="#">
                고객센터
              </A>
            </Li>
            <Li>
              <A className="policy-link" href="#">
                ESG
              </A>
            </Li>
            <Li>
              <A className="policy-link" href="#">
                사이트맵
              </A>
            </Li>
          </Ul>
        </Nav>

        {/* Band 3 — Info + Marks */}
        <Div className="footer-band footer-band--bottom">
          <Div className="footer-info">
            <Img
              className="footer-info__logo"
              src={`${ASSET_BASE}/brand/offset-theme-logo-light.png`}
              alt="Offset Theme 로고"
            />
            <P className="footer-info__row footer-info__row--inline">
              <Span className="info-cell">
                <Span className="label">상호</Span> 오프셋테마 (Offset Theme)
              </Span>
              <Span className="info-cell">
                <Span className="label">대표</Span> 허우제
              </Span>
              <Span className="info-cell">
                <Span className="label">이메일</Span> help@offsettheme.kr
              </Span>
            </P>
            <P className="footer-info__row">
              <Span className="label">주소</Span>
              <Span>서울특별시 강남구 테헤란로 152, 오프셋빌딩 8층</Span>
            </P>
            <P className="footer-info__row footer-info__row--inline">
              <Span className="info-cell">
                <Span className="label">TEL</Span> 1577-0000
              </Span>
              <Span className="info-cell">
                <Span className="label">사업자등록번호</Span> 123-45-67890
              </Span>
              <Span className="info-cell">
                <Span className="label">통신판매업신고</Span> 제2026-서울강남-1234호
              </Span>
            </P>
            <P className="footer-info__copy">
              © 2026 Offset Theme. All rights reserved.
            </P>
          </Div>

          <Div className="footer-marks" aria-label="오프셋테마 엠블럼">
            <Img
              className="footer-marks__img"
              src={`${ASSET_BASE}/footer/offset-badge-premium.png`}
              alt="오프셋테마 프리미엄 엠블럼"
            />
            <Img
              className="footer-marks__img"
              src={`${ASSET_BASE}/footer/offset-badge-studio.png`}
              alt="오프셋테마 디자인 스튜디오 엠블럼"
            />
          </Div>
        </Div>
      </Div>
    </Div>
  );
};

export default AictFooter;
