import React from 'react';
import { Div, Section, Nav, Ol, Li, A, Span, P, H3, Ul, Button } from '../basic';
import ThemeGalleryViewer from './ThemeGalleryViewer';
import BuyCardSticky, { SpecRow } from './BuyCardSticky';
import ChangelogTimeline, { ChangelogEntry } from './ChangelogTimeline';

export interface ThemeDetailContentProps {
  /** 게시판 글 ID (post-nav, breadcrumb 링크 등에 사용) */
  id?: number | string;
  /** 카테고리 (BUSINESS 등) */
  category?: string;
  /** 글 제목 (= 테마명) */
  title: string;
  /** 한 줄 요약 — buy-card 와 본문 상단에 사용 */
  summary?: string;
  /** 상세 설명 본문 (HTML, <br> 등 허용) */
  description?: string;
  /** 갤러리 이미지 배열 */
  gallery?: string[];
  /** 포함 구성 글머리표 */
  features?: string[];
  /** 변경 이력 */
  changelog?: ChangelogEntry[];
  /** 안내 callout (설치 안내 등) — HTML 허용 */
  installNote?: string;
  /** 가격 */
  price?: number | string;
  /** 평점/리뷰 */
  rating?: number;
  reviewCount?: number;
  /** 구매·데모 링크 */
  purchaseHref?: string;
  demoHref?: string;
  /** 사양 행 */
  specs?: SpecRow[];
  /** post-nav (이전·다음 글) */
  prevPost?: { id: number | string; title: string };
  nextPost?: { id: number | string; title: string };
  /** 목록 페이지 href */
  listHref?: string;
  /** 게시판 base href — post-nav 링크 구성용 */
  baseHref?: string;
  /** 상세 페이지 상단에 표시되는 게시판명 (큰 헤딩) */
  boardLabel?: string;
  /** 수정 버튼 노출 — post.is_owner 또는 abilities.write 바인딩 */
  canEdit?: boolean;
  /** 삭제 버튼 노출 — post.is_owner 또는 abilities.delete 바인딩 */
  canDelete?: boolean;
  /** 수정 페이지 URL — 기본 어드민 수정 화면 */
  editHref?: string;
  /** 삭제 API endpoint */
  deleteEndpoint?: string;
  /** 삭제 후 이동할 URL */
  afterDeleteHref?: string;
}

const renderHtmlBR = (text: string) =>
  text.split(/<br\s*\/?>/i).map((line, i, arr) => (
    <React.Fragment key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </React.Fragment>
  ));

const ThemeDetailContent: React.FC<ThemeDetailContentProps> = ({
  id,
  category,
  title,
  summary,
  description,
  gallery,
  features,
  changelog,
  installNote,
  price,
  rating,
  reviewCount,
  purchaseHref,
  demoHref,
  specs,
  prevPost,
  nextPost,
  listHref = '/board/theme',
  baseHref = '/board/theme',
  boardLabel = '테마',
  canEdit = false,
  canDelete = false,
  editHref,
  deleteEndpoint,
  afterDeleteHref,
}) => {
  /**
   * 삭제 트리거 — 공식 패턴 사용:
   *  1) _global.deleteModal 에 메타 set (type/apiEndpoint/redirectPath 등)
   *  2) board_delete_modal 공용 모달 open
   *
   * 실제 DELETE 요청과 후처리(navigate, toast, refetch)는
   * partials/board/show/modals/_modal_delete.json 가 담당합니다.
   * (참고: docs/frontend/modal-usage.md, layouts/board/show.json)
   */
  const handleDelete = () => {
    if (typeof window === 'undefined') return;
    const core = (window as any).G7Core;
    const endpoint = deleteEndpoint ?? (id != null ? `/api/modules/sirsoft-board/boards/theme/posts/${id}` : null);
    if (!endpoint) return;
    const redirectPath = afterDeleteHref ?? listHref;

    if (!core?.dispatch) {
      console.error('[ThemeDetailContent] G7Core.dispatch unavailable — cannot open delete modal');
      return;
    }

    core.dispatch({
      handler: 'sequence',
      actions: [
        {
          handler: 'setState',
          params: {
            target: 'global',
            deleteModal: {
              type: 'post',
              isGuest: false,
              apiEndpoint: endpoint,
              password: null,
              redirectPath,
            },
          },
        },
        {
          handler: 'openModal',
          target: 'board_delete_modal',
        },
      ],
    });
  };

  return (
    <Div className="theme-detail">
      {/* DETAIL TOP — 게시판명 큰 헤딩 (브레드크럼 대신) */}
      <Section className="detail-top">
        <Div className="aict-layout">
          <A href={listHref} className="detail-board-heading" aria-label={`${boardLabel} 목록으로`}>
            {boardLabel}
          </A>
        </Div>
      </Section>

      {/* DETAIL MAIN — 2-column grid */}
      <Section className="detail-main">
        <Div className="aict-layout detail-main__grid">
          {/* LEFT: gallery + body */}
          <article className="detail-content">
            <ThemeGalleryViewer images={gallery ?? []} alt={`${title} 미리보기`} />

            <Div className="detail-body">
              {description && (
                <>
                  <H3 className="detail-body__h">테마 소개</H3>
                  {description.split(/\n\n+/).map((para, i) => (
                    <P key={i}>{renderHtmlBR(para)}</P>
                  ))}
                </>
              )}

              {features && features.length > 0 && (
                <>
                  <H3 className="detail-body__h">포함 구성</H3>
                  <Ul className="detail-list">
                    {features.map((f, i) => (
                      <Li key={i}>{f}</Li>
                    ))}
                  </Ul>
                </>
              )}

              <ChangelogTimeline entries={changelog ?? []} />

              {installNote && (
                <aside className="callout">
                  <strong className="callout__title">설치 안내</strong>
                  <P>{renderHtmlBR(installNote)}</P>
                </aside>
              )}
            </Div>
          </article>

          {/* RIGHT: sticky buy-card */}
          <aside className="detail-aside">
            <BuyCardSticky
              category={category}
              title={title}
              summary={summary}
              price={price}
              rating={rating}
              reviewCount={reviewCount}
              purchaseHref={purchaseHref}
              demoHref={demoHref}
              specs={specs ?? []}
            />
          </aside>
        </Div>
      </Section>

      {/* DETAIL NAV — prev/next + list */}
      <Section className="detail-nav-wrap">
        <Div className="aict-layout">
          <Nav className="post-nav" aria-label="이전·다음 글">
            {prevPost ? (
              <A href={`${baseHref}/${prevPost.id}`} className="post-nav__item post-nav__item--prev">
                <Span className="post-nav__label">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  이전 테마
                </Span>
                <Span className="post-nav__title">{prevPost.title}</Span>
              </A>
            ) : (
              <Div className="post-nav__item post-nav__item--prev is-disabled" aria-disabled="true">
                <Span className="post-nav__label">이전 테마 없음</Span>
              </Div>
            )}
            {nextPost ? (
              <A href={`${baseHref}/${nextPost.id}`} className="post-nav__item post-nav__item--next">
                <Span className="post-nav__label">
                  다음 테마
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Span>
                <Span className="post-nav__title">{nextPost.title}</Span>
              </A>
            ) : (
              <Div className="post-nav__item post-nav__item--next is-disabled" aria-disabled="true">
                <Span className="post-nav__label">다음 테마 없음</Span>
              </Div>
            )}
          </Nav>

          <Div className="detail-actions">
            <A href={listHref} className="btn btn--list">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <Span>목록으로</Span>
            </A>
            {canEdit && editHref && (
              <A href={editHref} className="btn btn--list">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <Span>수정</Span>
              </A>
            )}
            {canDelete && (
              <Button type="button" className="btn btn--list" onClick={handleDelete}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
                <Span>삭제</Span>
              </Button>
            )}
          </Div>
        </Div>
      </Section>
    </Div>
  );
};

export default ThemeDetailContent;
