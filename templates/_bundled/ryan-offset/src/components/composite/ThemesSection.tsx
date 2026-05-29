import React from 'react';
import { Div, Section, Ul, Li, A, Span, P, H2, H3, Img } from '../basic';

export interface ThemeCard {
  id?: number | string;
  thumbnail?: string;
  title: string;
  tag?: string;
  price?: number | string;
  summary?: string;
  href: string;
}

export interface ThemesSectionProps {
  /** 실제 theme 게시판 게시글 + 메타에서 매핑된 카드 목록 */
  posts?: ThemeCard[];
}

const EMPTY_POSTS: ThemeCard[] = [];

const formatPrice = (price?: number | string): string => {
  if (price === undefined || price === null || price === '') return '가격 문의';
  const n = Number(price);
  if (!Number.isFinite(n) || n <= 0) return '가격 문의';
  return '₩' + n.toLocaleString('ko-KR');
};

const ThemesSection: React.FC<ThemesSectionProps> = ({ posts = EMPTY_POSTS }) => {
  return (
    <Section className="section section-themes" aria-label="테마 라인업">
      <Div className="aict-layout">
        <Div className="themes-head" role="banner">
          <Div className="themes-head__left">
            <H2 className="section-tit">오프셋테마 라인업</H2>
          </Div>
          <Div className="themes-head__right">
            <A href="/board/theme" className="themes-head__cta">
              전체 테마 보기 <Span aria-hidden="true">→</Span>
            </A>
          </Div>
        </Div>

        {posts.length > 0 ? (
          <Ul className="themes-grid">
            {posts.map((c, i) => (
              <Li key={c.id ?? i} className="theme-card">
                <A href={c.href} className="theme-card__link">
                  <Span className="theme-card__media">
                    {c.thumbnail ? (
                      <Img src={c.thumbnail} alt={`${c.title} 미리보기`} loading="lazy" />
                    ) : null}
                    <Span className="theme-card__hover" aria-hidden="true">
                      <Span className="theme-card__cta">
                        데모 보기 <em>→</em>
                      </Span>
                    </Span>
                  </Span>
                  <Div className="theme-card__body">
                    <Div className="theme-card__row">
                      {c.tag ? <Span className="theme-card__tag">{c.tag}</Span> : <Span />}
                      <Span className="theme-card__price">{formatPrice(c.price)}</Span>
                    </Div>
                    <H3 className="theme-card__title">{c.title}</H3>
                    {c.summary ? <P className="theme-card__desc">{c.summary}</P> : null}
                  </Div>
                </A>
              </Li>
            ))}
          </Ul>
        ) : (
          <P className="themes-empty">등록된 테마가 곧 공개됩니다.</P>
        )}
      </Div>
    </Section>
  );
};

export default ThemesSection;
