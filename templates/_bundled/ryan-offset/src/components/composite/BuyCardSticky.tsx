import React from 'react';
import { Div, Span, P, H2, A, Ul, Li } from '../basic';
import BuilderBadge from './BuilderBadge';

export interface SpecRow {
  label: string;
  value: string;
}

export interface BuyCardStickyProps {
  category?: string;
  builder?: string;
  title: string;
  summary?: string;
  rating?: number;
  reviewCount?: number;
  price?: number | string;
  priceNote?: string;
  purchaseHref?: string;
  demoHref?: string;
  /** 사양 행 (최소 요구 / 라이선스 / 업데이트 / 다운로드 등) */
  specs?: SpecRow[];
  /** 공유 버튼 표시 여부 */
  showShare?: boolean;
}

const EMPTY: SpecRow[] = [];

const formatPrice = (p: number | string | undefined) => {
  if (p === undefined || p === null || p === '') return '';
  const n = typeof p === 'number' ? p : Number(p);
  if (Number.isNaN(n)) return String(p);
  return '₩' + n.toLocaleString('ko-KR');
};

/**
 * 테마 상세 페이지 우측 sticky 구매 박스.
 * 카테고리 태그 + 제목 + 요약 + 별점 + 가격 + 구매/데모 CTA + 사양표 + 공유.
 */
const BuyCardSticky: React.FC<BuyCardStickyProps> = ({
  category,
  builder,
  title,
  summary,
  rating = 0,
  reviewCount = 0,
  price,
  priceNote = '1도메인 라이선스',
  purchaseHref = '#',
  demoHref = '#',
  specs = EMPTY,
  showShare = true,
}) => {
  const safeRating = Math.max(0, Math.min(5, rating));
  const starsWidth = (safeRating / 5) * 100;

  return (
    <Div className="buy-card">
      <Div className="buy-card__tags">
        {category && <Span className="buy-card__tag">{category}</Span>}
        <BuilderBadge builder={builder} />
      </Div>
      <H2 className="buy-card__title">{title}</H2>
      {summary && <P className="buy-card__sub">{summary}</P>}

      {(reviewCount > 0 || rating > 0) && (
        <Div className="buy-card__rating">
          <Span className="stars" aria-label={`평점 5점 중 ${safeRating}점`}>
            <Span className="stars__fill" style={{ width: `${starsWidth}%` }} />
          </Span>
          <Span className="rating-num">{safeRating.toFixed(1)}</Span>
          <Span className="rating-count">({reviewCount} 리뷰)</Span>
        </Div>
      )}

      <Div className="buy-card__price">
        <strong className="price-val">{formatPrice(price)}</strong>
        <Span className="price-note">{priceNote}</Span>
      </Div>

      <Div className="buy-card__cta">
        <A href={purchaseHref} className="btn btn--primary">
          <Span>구매하기</Span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <polyline points="13 6 19 12 13 18" />
          </svg>
        </A>
        <A href={demoHref} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polygon points="6 4 20 12 6 20 6 4" />
          </svg>
          <Span>데모 보기</Span>
        </A>
      </Div>

      {specs.length > 0 && (
        <dl className="spec-list">
          {specs.map((s, i) => (
            <Div key={i} className="spec-row">
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </Div>
          ))}
        </dl>
      )}

      {showShare && (
        <Div className="share">
          <Span className="share__label">공유</Span>
          <Ul className="share__list">
            <Li>
              <A href="#" className="share__btn" aria-label="페이스북으로 공유">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M13 22v-8h2.7l.4-3.1H13V8.9c0-.9.3-1.5 1.6-1.5H16V4.6c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.5H7.3V14H10v8h3z" />
                </svg>
              </A>
            </Li>
            <Li>
              <A href="#" className="share__btn" aria-label="트위터로 공유">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </A>
            </Li>
            <Li>
              <A href="#" className="share__btn" aria-label="카카오톡으로 보내기">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7L5.4 22l4.4-2.9c.7.1 1.4.2 2.2.2 5.5 0 10-3.6 10-8.3S17.5 3 12 3z" />
                </svg>
              </A>
            </Li>
            <Li>
              <A
                href="#"
                className="share__btn"
                aria-label="링크 복사"
                onClick={(e) => {
                  e.preventDefault();
                  if (typeof window !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.07 0l3.93-3.93a5 5 0 0 0-7.07-7.07L11.5 4.5" />
                  <path d="M14 11a5 5 0 0 0-7.07 0L3 14.93a5 5 0 0 0 7.07 7.07L12.5 19.5" />
                </svg>
              </A>
            </Li>
          </Ul>
        </Div>
      )}
    </Div>
  );
};

export default BuyCardSticky;
