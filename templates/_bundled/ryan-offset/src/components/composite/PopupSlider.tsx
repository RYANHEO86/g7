import React, { useEffect, useRef, useState } from 'react';
import { Div, H3, Button, Span, Img, A } from '../basic';

export interface PopupSlideItem {
  image: string;
  alt?: string;
  href?: string;
}

export interface PopupSliderProps {
  posters: PopupSlideItem[];
  intervalMs?: number;
  title?: string;
  className?: string;
  initialPaused?: boolean;
  /** prev/next/pause 아이콘 경로 — 코어에서 주입 */
  prevIcon?: string;
  nextIcon?: string;
  pauseIcon?: string;
}

const EMPTY_POSTERS: PopupSlideItem[] = [];

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * S4 알림마당 영역의 POPUP ZONE 포스터 슬라이더.
 * 5.5초 자동 전환 (intervalMs 기본값), prev/pause/next 컨트롤.
 */
const PopupSlider: React.FC<PopupSliderProps> = ({
  posters = EMPTY_POSTERS,
  intervalMs = 5500,
  title = 'POPUP ZONE',
  className = '',
  initialPaused = false,
  prevIcon = '/api/templates/assets/ryan-offset/assets/images/aict/main/icon-arrow-prev.svg',
  nextIcon = '/api/templates/assets/ryan-offset/assets/images/aict/main/icon-arrow-next.svg',
  pauseIcon = '/api/templates/assets/ryan-offset/assets/images/aict/main/icon-arrow-stop.svg',
}) => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(initialPaused);
  const timerRef = useRef<number | null>(null);
  const total = posters.length;

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

  const goPrev = () => total > 1 && setIdx((i) => (i - 1 + total) % total);
  const goNext = () => total > 1 && setIdx((i) => (i + 1) % total);

  const composed = ['popup-zone', className].filter(Boolean).join(' ');

  return (
    <Div className={composed} id="popup-zone">
      <Div className="popup-zone__head">
        <H3 className="popup-zone__title">{title}</H3>
      </Div>

      <Div className="popup-zone__stage">
        {posters.map((p, i) => (
          <A
            key={i}
            href={p.href ?? '#'}
            className={`popup-slide${i === idx ? ' is-active' : ''}`}
            data-index={i}
          >
            <Img src={p.image} alt={p.alt ?? `포스터 ${i + 1}`} loading="lazy" />
          </A>
        ))}

        <Div className="popup-zone__controls">
          <Button type="button" className="prev" aria-label="이전 슬라이드" onClick={goPrev}>
            <Img src={prevIcon} alt="" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            className="pause"
            aria-label={paused ? '재생' : '일시정지'}
            onClick={() => setPaused((p) => !p)}
          >
            <Img src={pauseIcon} alt="" aria-hidden="true" />
          </Button>
          <Span className="popup-zone__counter">
            <Span id="pz-cur" style={{ fontWeight: 700 }}>
              {pad2(idx + 1)}
            </Span>
            <Span className="popup-zone__sep">/</Span>
            <Span id="pz-total">{pad2(total)}</Span>
          </Span>
          <Button type="button" className="next" aria-label="다음 슬라이드" onClick={goNext}>
            <Img src={nextIcon} alt="" aria-hidden="true" />
          </Button>
        </Div>
      </Div>
    </Div>
  );
};

export default PopupSlider;
