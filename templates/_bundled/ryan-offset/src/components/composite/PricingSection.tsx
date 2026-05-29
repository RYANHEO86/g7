import React, { useState } from 'react';
import { Div, Section, Ul, Li, A, Span, P, H2, H3, H4, Button } from '../basic';

/* ============================================================
   오프셋테마 가격 페이지 — 4티어 + 옵션 + 비교표 + FAQ + 진단위젯
   정적 데이터 내장, 상호작용은 컴포넌트 내부 useState.
   ============================================================ */

interface PlanFeature {
  text: string;
  /** 상위 플랜에서 새로 추가되는 핵심 항목 강조 */
  highlight?: boolean;
}

interface Plan {
  key: 'buy' | 'setup' | 'plus' | 'premium';
  badge?: string;
  eyebrow: string;
  name: string;
  sub: string;
  price: string;
  priceNote: string;
  features: PlanFeature[];
  ctaLabel: string;
  ctaHref: string;
  featured?: boolean;
}

const PLANS: Plan[] = [
  {
    key: 'buy',
    eyebrow: 'SELF',
    name: '테마 구매',
    sub: '직접 설치·운영하는 분',
    price: '₩89,000',
    priceNote: '부터 · 테마별 상이',
    features: [
      { text: '테마 파일 (ZIP)' },
      { text: '설치 가이드 문서' },
      { text: '평생 무료 업데이트' },
      { text: '1:1 설치 Q&A' },
    ],
    ctaLabel: '테마 보러가기',
    ctaHref: '/board/theme',
  },
  {
    key: 'setup',
    badge: '가장 인기',
    eyebrow: 'BASIC',
    name: '베이직',
    sub: '설치부터 오픈까지 맡기는 분',
    price: '테마가 + ₩300,000',
    priceNote: '예: ₩389,000 부터',
    features: [
      { text: '테마 구매 전체 포함' },
      { text: '설치 + 도메인 연결', highlight: true },
      { text: '메인페이지 세팅', highlight: true },
      { text: '커스텀 페이지 3종 제작', highlight: true },
      { text: '콘텐츠 반영 · 반응형 점검' },
      { text: 'SEO 기본 세팅' },
    ],
    ctaLabel: '베이직 의뢰하기',
    ctaHref: '/inquiry',
    featured: true,
  },
  {
    key: 'plus',
    eyebrow: 'PLUS',
    name: '플러스',
    sub: '우리 브랜드 색을 입히는 분',
    price: '테마가 + ₩790,000',
    priceNote: '부터 · 범위에 따라 협의',
    features: [
      { text: '베이직 전체 포함' },
      { text: '맞춤 이미지 제작 (AI 활용)', highlight: true },
      { text: '맞춤 문구 · 카피라이팅', highlight: true },
      { text: '커스텀 페이지 8종 제작', highlight: true },
      { text: '로고 리터치' },
    ],
    ctaLabel: '플러스 상담',
    ctaHref: '/inquiry',
  },
  {
    key: 'premium',
    eyebrow: 'PREMIUM',
    name: '프리미엄',
    sub: '웹사이트를 넘어, 플랫폼으로',
    price: '별도 견적',
    priceNote: '요구사항 기반 맞춤 산정',
    features: [
      { text: '플러스 전체 포함' },
      { text: '회원·결제·예약 등 기능 개발', highlight: true },
      { text: '관리자 대시보드 · 데이터 연동', highlight: true },
      { text: '외부 API · 서비스 연동', highlight: true },
      { text: '디자인 풀 커스텀 · 페이지 무제한' },
      { text: '전담 PM · 지속 유지보수' },
    ],
    ctaLabel: '프리미엄 문의',
    ctaHref: '/inquiry',
  },
];

interface AddOn {
  label: string;
  price: string;
}

const ADDONS: AddOn[] = [
  { label: '커스텀 페이지 추가 (1종)', price: '+₩80,000' },
  { label: 'AI 이미지 추가 (5컷)', price: '+₩150,000' },
  { label: '카피라이팅 (페이지당)', price: '+₩100,000' },
  { label: '로고 제작', price: '+₩200,000' },
  { label: '다국어(영문) 추가', price: '+₩300,000' },
  { label: '기존 사이트 콘텐츠 이전', price: '견적' },
  { label: '월 유지보수', price: '₩90,000 / 월' },
];

interface CompareRow {
  label: string;
  /** buy, setup, plus, premium 순서 — true=포함, false=미포함, string=값 */
  values: (boolean | string)[];
}

const COMPARE_ROWS: CompareRow[] = [
  { label: '테마 파일 제공', values: [true, true, true, true] },
  { label: '평생 무료 업데이트', values: [true, true, true, true] },
  { label: '설치 · 도메인 연결', values: [false, true, true, true] },
  { label: '메인페이지 세팅', values: [false, true, true, true] },
  { label: '커스텀 페이지', values: ['—', '3종', '8종', '무제한 협의'] },
  { label: 'SEO 기본 세팅', values: [false, true, true, true] },
  { label: '맞춤 이미지 (AI 활용)', values: [false, false, true, true] },
  { label: '맞춤 카피라이팅', values: [false, false, true, true] },
  { label: '로고 작업', values: [false, false, '리터치', '신규 제작'] },
  { label: '기능 개발 (회원·결제 등)', values: [false, false, false, true] },
  { label: '관리자 대시보드 · 연동', values: [false, false, false, true] },
  { label: '디자인 풀 커스텀', values: [false, false, false, true] },
  { label: '유지보수', values: [false, '옵션', '옵션', '전담'] },
];

const PLAN_LABELS = ['테마 구매', '베이직', '플러스', '프리미엄'];

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: '테마만 구매해서 직접 설치해도 되나요?',
    a: '네. 테마 구매 플랜은 파일과 설치 가이드를 제공하며, 직접 설치하실 수 있도록 1:1 Q&A를 지원합니다.',
  },
  {
    q: '셋팅은 보통 얼마나 걸리나요?',
    a: '테마+셋팅 기준 평균 7~14일 정도 소요됩니다. 플러스·프리미엄은 범위에 따라 상담 시 일정을 안내드립니다.',
  },
  {
    q: '커스텀 페이지 3종 / 8종은 어떤 의미인가요?',
    a: '소개·서비스·문의처럼 메인 외에 추가로 디자인·제작해 드리는 페이지 수입니다. 더 필요하면 옵션으로 1종씩 추가할 수 있습니다.',
  },
  {
    q: '맞춤 이미지는 어떤 식으로 만들어지나요?',
    a: '브랜드 톤과 업종에 맞춰 히어로·배경·제품컷 등을 AI로 제작한 뒤, 사람이 검수·보정해 자연스럽게 반영합니다.',
  },
  {
    q: '나중에 상위 플랜으로 업그레이드할 수 있나요?',
    a: '가능합니다. 차액과 추가 작업 범위만 정산하면 언제든 셋팅·플러스·프리미엄으로 확장할 수 있습니다.',
  },
  {
    q: '환불 정책은 어떻게 되나요?',
    a: '테마 파일은 디지털 상품 특성상 다운로드 전까지 환불 가능하며, 제작형 플랜은 착수 전까지 전액 환불됩니다.',
  },
];

/* 진단 위젯: 3개의 질문 답에 따라 추천 플랜 결정 */
type DiagnoseAnswer = 'self' | 'fast' | 'brand' | 'feature' | null;

const PricingSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [recommend, setRecommend] = useState<Plan['key'] | null>(null);

  const pickRecommend = (a: DiagnoseAnswer) => {
    if (a === 'self') setRecommend('buy');
    else if (a === 'fast') setRecommend('setup');
    else if (a === 'brand') setRecommend('plus');
    else if (a === 'feature') setRecommend('premium');
  };

  return (
    <Section className="section pricing" aria-label="가격 안내">
      <Div className="aict-layout">
        {/* 인트로 */}
        <Div className="pricing-intro reveal">
          <P className="pricing-intro__lead">
            필요한 만큼만 고르세요. 직접 설치부터 풀빌드까지, 단계별로 준비했습니다.
          </P>
        </Div>

        {/* 진단 위젯 */}
        <Div className="pricing-diagnose reveal">
          <H3 className="pricing-diagnose__title">3초 진단 — 나에게 맞는 플랜은?</H3>
          <Div className="pricing-diagnose__options">
            <Button
              type="button"
              className={`diagnose-opt${recommend === 'buy' ? ' is-active' : ''}`}
              onClick={() => pickRecommend('self')}
            >
              직접 설치할 수 있어요
            </Button>
            <Button
              type="button"
              className={`diagnose-opt${recommend === 'setup' ? ' is-active' : ''}`}
              onClick={() => pickRecommend('fast')}
            >
              빨리 오픈하고 싶어요
            </Button>
            <Button
              type="button"
              className={`diagnose-opt${recommend === 'plus' ? ' is-active' : ''}`}
              onClick={() => pickRecommend('brand')}
            >
              브랜드 색을 입히고 싶어요
            </Button>
            <Button
              type="button"
              className={`diagnose-opt${recommend === 'premium' ? ' is-active' : ''}`}
              onClick={() => pickRecommend('feature')}
            >
              기능까지 필요해요
            </Button>
          </Div>
        </Div>

        {/* 4 플랜 카드 */}
        <Ul className="pricing-grid">
          {PLANS.map((plan) => {
            const isPicked = recommend === plan.key;
            const cardClass = [
              'pricing-card',
              plan.featured ? 'pricing-card--featured' : '',
              isPicked ? 'pricing-card--picked' : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <Li key={plan.key} className={cardClass}>
                {plan.badge ? <Span className="pricing-card__badge">{plan.badge}</Span> : null}
                <Span className="pricing-card__eyebrow">{plan.eyebrow}</Span>
                <H3 className="pricing-card__name">{plan.name}</H3>
                <P className="pricing-card__sub">{plan.sub}</P>
                <Div className="pricing-card__price">
                  <Span className="pricing-card__price-value">{plan.price}</Span>
                  <Span className="pricing-card__price-note">{plan.priceNote}</Span>
                </Div>
                <Ul className="pricing-card__features">
                  {plan.features.map((f, i) => (
                    <Li
                      key={i}
                      className={`pricing-feat${f.highlight ? ' pricing-feat--hl' : ''}`}
                    >
                      <Span className="pricing-feat__check" aria-hidden="true">
                        ✓
                      </Span>
                      {f.text}
                    </Li>
                  ))}
                </Ul>
                <A href={plan.ctaHref} className="pricing-card__cta">
                  {plan.ctaLabel} <Span aria-hidden="true">→</Span>
                </A>
              </Li>
            );
          })}
        </Ul>

        {/* 옵션 추가 */}
        <Div className="pricing-addons reveal">
          <H3 className="pricing-block-title">옵션 추가</H3>
          <P className="pricing-block-desc">필요한 작업만 단품으로 더할 수 있습니다.</P>
          <Ul className="addon-list">
            {ADDONS.map((a, i) => (
              <Li key={i} className="addon-item">
                <Span className="addon-item__label">{a.label}</Span>
                <Span className="addon-item__price">{a.price}</Span>
              </Li>
            ))}
          </Ul>
        </Div>

        {/* 상세 비교표 */}
        <Div className="pricing-compare reveal">
          <H3 className="pricing-block-title">플랜 상세 비교</H3>
          <Div className="compare-scroll">
            <table className="compare-table">
              <thead>
                <tr>
                  <th className="compare-table__rowhead">항목</th>
                  {PLAN_LABELS.map((label, i) => (
                    <th key={i} className="compare-table__planhead">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, ri) => (
                  <tr key={ri}>
                    <td className="compare-table__rowhead">{row.label}</td>
                    {row.values.map((v, ci) => (
                      <td key={ci} className="compare-table__cell">
                        {v === true ? (
                          <Span className="compare-yes" aria-label="포함">
                            ✓
                          </Span>
                        ) : v === false ? (
                          <Span className="compare-no" aria-label="미포함">
                            —
                          </Span>
                        ) : (
                          <Span className="compare-val">{v}</Span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Div>
        </Div>

        {/* FAQ */}
        <Div className="pricing-faq reveal">
          <H3 className="pricing-block-title">자주 묻는 질문</H3>
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

        {/* 마지막 CTA */}
        <Div className="pricing-final reveal">
          <H4 className="pricing-final__title">어떤 게 맞을지 모르겠다면?</H4>
          <P className="pricing-final__desc">상황만 알려주시면 가장 알맞은 플랜을 무료로 제안해 드립니다.</P>
          <A href="/inquiry" className="pricing-final__cta">
            무료 상담 받기 <Span aria-hidden="true">→</Span>
          </A>
        </Div>
      </Div>
    </Section>
  );
};

export default PricingSection;
