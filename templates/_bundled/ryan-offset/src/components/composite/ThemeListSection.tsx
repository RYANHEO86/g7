import React, { useMemo, useState } from 'react';
import { Div, Section, Ul, Li, A, Span, P, H2, H3, Button, Form, Input, Select, Option, Img, Nav, Ol, Label } from '../basic';

export interface ThemeCardItem {
  id: number | string;
  title: string;
  summary?: string;
  thumbnail?: string;
  category?: string;
  price?: number | string;
  href?: string;
}

export interface ThemeCategoryDef {
  key: string;
  label: string;
}

export interface ThemeListSectionProps {
  /** 카테고리 필터 — { key:'all', label:'전체' } 포함 */
  categories?: ThemeCategoryDef[];
  /** 전체 카드 목록 (서버에서 한 번에 받아 클라이언트 필터/정렬/페이징) */
  posts?: ThemeCardItem[];
  /** 한 페이지 카드 수 */
  perPage?: number;
  /** 상세 페이지 base href — `${baseHref}/${id}` 로 카드 링크 구성 */
  baseHref?: string;
}

const EMPTY_CATS: ThemeCategoryDef[] = [];
const EMPTY_POSTS: ThemeCardItem[] = [];

const DEFAULT_CATS: ThemeCategoryDef[] = [
  { key: 'all', label: '전체' },
  { key: 'BUSINESS', label: '비즈니스' },
  { key: 'PORTFOLIO', label: '포트폴리오' },
  { key: 'SHOP', label: '쇼핑몰' },
  { key: 'MAGAZINE', label: '매거진' },
];

const formatPrice = (p: number | string | undefined) => {
  if (p === undefined || p === null || p === '') return '';
  const n = typeof p === 'number' ? p : Number(p);
  if (Number.isNaN(n)) return String(p);
  return '₩' + n.toLocaleString('ko-KR');
};

/**
 * 테마 게시판 리스트 페이지 본체.
 * page-hero(브레드크럼 + 타이틀) + filter chips + search + sort + 카드 그리드 + pager.
 * 데이터는 props.posts(배열) 한 번에 받음 — 클라이언트 사이드 필터/정렬/페이징.
 */
const ThemeListSection: React.FC<ThemeListSectionProps> = ({
  categories = EMPTY_CATS,
  posts = EMPTY_POSTS,
  perPage = 12,
  baseHref = '/board/theme',
}) => {
  const cats = categories.length > 0 ? categories : DEFAULT_CATS;
  const [activeCat, setActiveCat] = useState<string>(cats[0]?.key ?? 'all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'latest' | 'popular' | 'name'>('latest');
  const [page, setPage] = useState(1);

  // 카테고리별 카운트
  const counts = useMemo(() => {
    const m: Record<string, number> = { all: posts.length };
    posts.forEach((p) => {
      if (p.category) m[p.category] = (m[p.category] ?? 0) + 1;
    });
    return m;
  }, [posts]);

  // 필터 + 검색 + 정렬
  const filtered = useMemo(() => {
    let list = posts.slice();
    if (activeCat !== 'all') {
      list = list.filter((p) => (p.category ?? '').toUpperCase() === activeCat.toUpperCase());
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.summary ?? '').toLowerCase().includes(q),
      );
    }
    if (sort === 'name') list.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
    else if (sort === 'popular') {
      // popular은 price 큰 순으로 임시 매핑 (extra_data.download_count 등 추가 정보 없이)
      list.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));
    }
    // latest = 원본 순서 유지 (서버가 created_at desc 로 보내준다 가정)
    return list;
  }, [posts, activeCat, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  return (
    <Div className="theme-list">
      {/* THEME LIST */}
      <Section className="theme-list" aria-label="테마 목록">
        <Div className="aict-layout">
          {/* Controls */}
          <Div className="theme-list__controls">
            <Div className="theme-list__filter" role="tablist" aria-label="테마 카테고리">
              {cats.map((c) => (
                <Button
                  key={c.key}
                  type="button"
                  className={`filter-chip${activeCat === c.key ? ' is-active' : ''}`}
                  data-tab={c.key}
                  aria-selected={activeCat === c.key}
                  onClick={() => { setActiveCat(c.key); setPage(1); }}
                >
                  {c.label} <Span className="filter-chip__count">{counts[c.key] ?? 0}</Span>
                </Button>
              ))}
            </Div>

            <Form
              className="theme-search"
              role="search"
              onSubmit={(e) => { e.preventDefault(); setPage(1); }}
            >
              <Label className="blind" htmlFor="theme-q">테마 검색</Label>
              <Input
                id="theme-q"
                className="theme-search__input"
                type="search"
                placeholder="테마 이름·키워드 검색"
                autoComplete="off"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              />
              <Button className="theme-search__btn" type="submit" aria-label="검색">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </Button>
            </Form>
          </Div>

          {/* Meta */}
          <Div className="theme-list__meta">
            <P className="theme-list__count">
              총 <strong>{filtered.length}</strong>개의 테마
            </P>
            <Div className="theme-list__sort">
              <Label className="blind" htmlFor="theme-sort">정렬</Label>
              <Select
                id="theme-sort"
                className="theme-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
              >
                <Option value="latest">최신순</Option>
                <Option value="popular">인기순</Option>
                <Option value="name">이름순</Option>
              </Select>
            </Div>
          </Div>

          {/* Card Grid */}
          <Ul className="theme-list__grid" data-list={activeCat}>
            {pageItems.length === 0 && (
              <Li style={{ gridColumn: '1 / -1', padding: '60px 0', textAlign: 'center', color: 'var(--muted)' }}>
                해당 조건의 테마가 없습니다.
              </Li>
            )}
            {pageItems.map((p) => (
              <Li key={p.id} className="theme-card">
                <A href={p.href ?? `${baseHref}/${p.id}`} className="theme-card__link">
                  <Div className="theme-card__media">
                    {p.thumbnail && <Img src={p.thumbnail} alt={`${p.title} 미리보기`} loading="lazy" />}
                    <Div className="theme-card__hover">
                      <Span className="theme-card__cta"><em>미리보기</em> →</Span>
                    </Div>
                  </Div>
                  <Div className="theme-card__body">
                    <Div className="theme-card__row">
                      <Span className="theme-card__tag">{p.category ?? ''}</Span>
                      <Span className="theme-card__price">{formatPrice(p.price)}</Span>
                    </Div>
                    <H3 className="theme-card__title">{p.title}</H3>
                    {p.summary && <P className="theme-card__desc">{p.summary}</P>}
                  </Div>
                </A>
              </Li>
            ))}
          </Ul>

          {/* Pager */}
          {totalPages > 1 && (
            <Nav className="pager" aria-label="페이지 이동">
              <A
                href="#"
                className={`pager__btn pager__btn--prev${safePage <= 1 ? ' is-disabled' : ''}`}
                aria-label="이전 페이지"
                aria-disabled={safePage <= 1}
                onClick={(e) => { e.preventDefault(); if (safePage > 1) setPage(safePage - 1); }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </A>
              <Ol className="pager__list">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <Li key={n}>
                    <A
                      href="#"
                      className={`pager__num${n === safePage ? ' is-current' : ''}`}
                      aria-current={n === safePage ? 'page' : undefined}
                      onClick={(e) => { e.preventDefault(); setPage(n); }}
                    >
                      {n}
                    </A>
                  </Li>
                ))}
              </Ol>
              <A
                href="#"
                className={`pager__btn pager__btn--next${safePage >= totalPages ? ' is-disabled' : ''}`}
                aria-label="다음 페이지"
                aria-disabled={safePage >= totalPages}
                onClick={(e) => { e.preventDefault(); if (safePage < totalPages) setPage(safePage + 1); }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </A>
            </Nav>
          )}
        </Div>
      </Section>
    </Div>
  );
};

export default ThemeListSection;
