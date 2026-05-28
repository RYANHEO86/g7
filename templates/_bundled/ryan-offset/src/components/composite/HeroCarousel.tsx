import React, { useEffect, useRef, useState } from 'react';
import { Div, Section, Button, Span, A, P } from '../basic';

export interface HeroSlide {
  image: string;
  alt?: string;
}

export interface HeroCtaCard {
  label: string;
  href: string;
  /**
   * variant 옵션:
   * - 'building': .main-visual__button-card--building CSS 배경 사용 (테마 둘러보기)
   * - 'lab':      .main-visual__button-card--lab CSS 배경 사용 (제작의뢰)
   * - 'intro':    .main-visual__button-card--intro 브랜드 그라데이션 (오프셋 테마 소개)
   */
  variant: 'building' | 'lab' | 'intro';
}

export interface HeroCarouselProps {
  slides: HeroSlide[];
  intervalMs?: number;
  title?: string;
  subtitle?: string;
  /** description은 <br> 태그 허용 (정적 콘텐츠) */
  description?: string;
  ctaCards?: HeroCtaCard[];
  className?: string;
  initialPaused?: boolean;
  ariaLabel?: string;
}

const EMPTY_SLIDES: HeroSlide[] = [];
const EMPTY_CARDS: HeroCtaCard[] = [];

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * 메인 비주얼 자동 슬라이더
 * - 7초 자동 전환 (intervalMs)
 * - prev/next/pause/play 컨트롤
 * - 카운터 + 진행 바 (.bar는 CSS의 hero-bar keyframes로 채워짐)
 * - CTA 카드 3개 (building/lab/intro variant — CSS 정의 클래스 그대로 매핑)
 */
const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides = EMPTY_SLIDES,
  intervalMs = 7000,
  title,
  subtitle,
  description,
  ctaCards = EMPTY_CARDS,
  className = '',
  initialPaused = false,
  ariaLabel = '메인 비주얼',
}) => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(initialPaused);
  const timerRef = useRef<number | null>(null);
  const total = slides.length;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (paused || total <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIdx((i) => (i + 1) % total);
    }, intervalMs);
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [paused, total, intervalMs, idx]);

  const goPrev = () => {
    if (total <= 1) return;
    setIdx((i) => (i - 1 + total) % total);
  };
  const goNext = () => {
    if (total <= 1) return;
    setIdx((i) => (i + 1) % total);
  };

  const sectionClass = [
    'section',
    'section1',
    'main-visual',
    paused ? 'is-paused' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Section id="mainVisual" className={sectionClass} aria-label={ariaLabel}>
      <Div className="main-visual__track">
        {slides.map((s, i) => (
          <Div
            key={i}
            className={`main-visual__slide${i === idx ? ' is-active' : ''}`}
            data-idx={i + 1}
          >
            <Div
              className="main-visual__slide-bg"
              style={{ backgroundImage: `url('${s.image}')` }}
              role="img"
              aria-label={s.alt ?? ''}
            />
          </Div>
        ))}
      </Div>

      {(title || subtitle || description) && (
        <Div className="main-visual__copy">
          <Div className="aict-layout">
            {title && <P className="main-visual__title-main">{title}</P>}
            {subtitle && <P className="main-visual__title-sub">{subtitle}</P>}
            {description && (
              <P className="main-visual__description">
                {description.split(/<br\s*\/?>/i).map((line, i, arr) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </P>
            )}
          </Div>
        </Div>
      )}

      <Div className="main-visual__controls">
        <Div className="aict-layout">
          <Span className="main-visual__counter">
            <Span id="hero-current" style={{ fontWeight: 700 }}>
              {pad2(idx + 1)}
            </Span>
            <Span className="bar" />
            <Span id="hero-total">{pad2(total)}</Span>
          </Span>
          <Button
            type="button"
            className="main-visual__nav-button main-visual__nav-button--prev"
            aria-label="이전 슬라이드"
            onClick={goPrev}
          />
          {!paused ? (
            <Button
              type="button"
              className="main-visual__play-button-pause"
              aria-label="자동전환 정지"
              onClick={() => setPaused(true)}
            />
          ) : (
            <Button
              type="button"
              className="main-visual__play-button-play"
              aria-label="자동전환 재생"
              onClick={() => setPaused(false)}
            />
          )}
          <Button
            type="button"
            className="main-visual__nav-button main-visual__nav-button--next"
            aria-label="다음 슬라이드"
            onClick={goNext}
          />
        </Div>
      </Div>

      {ctaCards.length > 0 && (
        <Div className="main-visual__cards">
          <Div className="aict-layout">
            {ctaCards.map((c, i) => (
              <A
                key={i}
                href={c.href}
                className={`main-visual__button-card main-visual__button-card--${c.variant}`}
              >
                <Span className="main-visual__button-text">{c.label}</Span>
              </A>
            ))}
          </Div>
        </Div>
      )}
    </Section>
  );
};

export default HeroCarousel;
