import React, { useState } from 'react';
import { Div, Section, Ul, Li, A, Span, P, H3, H4, Button } from '../basic';

/* ============================================================
   문의(/contact) — FAQ + 내 문의 위젯 (로그인 본인 qna 글)
   작성/상세는 기존 board 라우트(/board/qna/...) 재활용.
   ============================================================ */

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: '테마는 어떤 빌더에서 쓸 수 있나요?',
    a: '현재 모든 테마는 리빌더(Rebuilder) 전용입니다. 각 테마 카드·상세에 호환 빌더 배지를 표시하고 있어요. 그누보드5·아미나빌더 등은 추후 확대 예정입니다.',
  },
  {
    q: '테마만 사서 직접 설치할 수 있나요?',
    a: '네. 테마 구매 플랜은 파일과 설치 가이드를 제공합니다. 직접 설치가 어렵다면 베이직(테마+셋팅) 플랜에서 설치부터 오픈까지 대행해 드립니다.',
  },
  {
    q: '셋팅·제작은 얼마나 걸리나요?',
    a: '베이직 기준 평균 7~14일입니다. 플러스·프리미엄은 범위에 따라 상담 시 일정을 안내드립니다. 가격 페이지에서 플랜별 포함 내역을 확인하세요.',
  },
  {
    q: '환불 정책은 어떻게 되나요?',
    a: '테마 파일은 디지털 상품 특성상 다운로드 전까지 환불 가능하며, 제작형 플랜(베이직·플러스·프리미엄)은 착수 전까지 전액 환불됩니다.',
  },
  {
    q: '라이선스는 어떻게 적용되나요?',
    a: '기본 1도메인 라이선스이며, 추가 도메인·상업적 활용 범위는 테마별 상세 또는 문의로 안내드립니다.',
  },
  {
    q: '구매 후 업데이트와 지원은요?',
    a: '평생 무료 업데이트와 1:1 설치 Q&A를 제공합니다. 더 깊은 기술지원은 플랜·옵션(월 유지보수)으로 확장할 수 있습니다.',
  },
];

export interface ContactQuestion {
  id: number | string;
  title: string;
  category?: string;
  status?: string;
  created_at?: string;
  href?: string;
}

export interface ContactSectionProps {
  /** 로그인 여부 */
  loggedIn?: boolean;
  /** 로그인 사용자 본인의 문의 글 목록 */
  questions?: ContactQuestion[];
  /** 새 문의 작성 경로 */
  writeHref?: string;
  /** 로그인 경로 */
  loginHref?: string;
  /** 제작 상담(제작의뢰) 경로 */
  inquiryHref?: string;
}

const EMPTY: ContactQuestion[] = [];

const ContactSection: React.FC<ContactSectionProps> = ({
  loggedIn = false,
  questions = EMPTY,
  writeHref = '/board/qna/write',
  loginHref = '/login',
  inquiryHref = '/inquiry',
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <Section className="section contact" aria-label="문의">
      <Div className="aict-layout">
        <P className="contact-intro reveal">
          궁금한 점은 먼저 자주 묻는 질문에서 확인해 보세요. 해결되지 않으면 1:1 문의를 남겨주시면
          확인 후 답변드립니다.
        </P>

        <Div className="contact-grid">
          {/* 좌: FAQ */}
          <Div className="contact-faq reveal">
            <H3 className="contact-block-title">자주 묻는 질문</H3>
            <Ul className="faq-list">
              {FAQS.map((item, i) => {
                const open = openFaq === i;
                return (
                  <Li key={i} className={`faq-item${open ? ' is-open' : ''}`}>
                    <Button
                      type="button"
                      className="faq-item__q"
                      aria-expanded={open}
                      onClick={() => setOpenFaq(open ? null : i)}
                    >
                      <Span className="faq-item__q-text">{item.q}</Span>
                      <Span className="faq-item__icon" aria-hidden="true">
                        {open ? '−' : '+'}
                      </Span>
                    </Button>
                    {open ? <P className="faq-item__a">{item.a}</P> : null}
                  </Li>
                );
              })}
            </Ul>
          </Div>

          {/* 우: 내 문의 위젯 */}
          <Div className="contact-aside reveal reveal--delay-1">
            <Div className="myq-card">
              <Div className="myq-card__head">
                <H4 className="myq-card__title">1:1 문의</H4>
                {loggedIn ? (
                  <A href={writeHref} className="myq-card__write">
                    새 문의 작성 <Span aria-hidden="true">→</Span>
                  </A>
                ) : null}
              </Div>

              {!loggedIn ? (
                <Div className="myq-empty">
                  <P className="myq-empty__text">
                    문의 작성·확인은 로그인 후 이용할 수 있어요. 내 문의는 나만 볼 수 있습니다.
                  </P>
                  <A href={loginHref} className="myq-empty__cta">
                    로그인하고 문의하기 <Span aria-hidden="true">→</Span>
                  </A>
                </Div>
              ) : questions.length > 0 ? (
                <Ul className="myq-list">
                  {questions.map((q) => (
                    <Li key={q.id} className="myq-item">
                      <A href={q.href ?? `/board/qna/${q.id}`} className="myq-item__link">
                        <Span className="myq-item__title">{q.title}</Span>
                        <Span className="myq-item__meta">
                          {q.category ? <Span className="myq-item__cat">{q.category}</Span> : null}
                          {q.created_at ? <Span className="myq-item__date">{q.created_at}</Span> : null}
                        </Span>
                      </A>
                    </Li>
                  ))}
                </Ul>
              ) : (
                <Div className="myq-empty">
                  <P className="myq-empty__text">아직 남긴 문의가 없습니다. 첫 문의를 남겨보세요.</P>
                  <A href={writeHref} className="myq-empty__cta">
                    문의 작성하기 <Span aria-hidden="true">→</Span>
                  </A>
                </Div>
              )}
            </Div>

            {/* 제작 상담 안내 */}
            <Div className="contact-inquiry">
              <P className="contact-inquiry__lead">제작·구축 상담이 필요하세요?</P>
              <P className="contact-inquiry__desc">
                베이직·플러스·프리미엄 등 맞춤 작업은 제작의뢰에서 더 자세히 상담해 드립니다.
              </P>
              <A href={inquiryHref} className="contact-inquiry__cta">
                제작 상담하기 <Span aria-hidden="true">→</Span>
              </A>
            </Div>
          </Div>
        </Div>
      </Div>
    </Section>
  );
};

export default ContactSection;
