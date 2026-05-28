import React, { useEffect, useRef, useState } from 'react';
import { Div, Span } from '../basic';

export interface CountUpProps {
  target: number;
  durationMs?: number;
  format?: 'ko-KR' | 'en-US' | 'plain';
  className?: string;
  suffix?: string;
  prefix?: string;
  rootMargin?: string;
  threshold?: number;
}

/**
 * 뷰포트 진입 시 0 → target 카운트업 애니메이션 (requestAnimationFrame).
 * 1회만 발화, 이후 unobserve.
 */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const formatNumber = (n: number, format: CountUpProps['format']): string => {
  const rounded = Math.round(n);
  if (format === 'ko-KR') return rounded.toLocaleString('ko-KR');
  if (format === 'en-US') return rounded.toLocaleString('en-US');
  return String(rounded);
};

const CountUp: React.FC<CountUpProps> = ({
  target,
  durationMs = 1300,
  format = 'ko-KR',
  className = '',
  suffix = '',
  prefix = '',
  rootMargin = '0px 0px -10% 0px',
  threshold = 0.2,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setValue(target);
      return;
    }
    if (!('IntersectionObserver' in window)) {
      setValue(target);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / durationMs);
        setValue(target * easeOutCubic(p));
        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            start();
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin, threshold },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, durationMs, rootMargin, threshold]);

  return (
    <Div className={className} ref={ref} style={{ display: 'inline-block' }}>
      <Span>
        {prefix}
        {formatNumber(value, format)}
        {suffix}
      </Span>
    </Div>
  );
};

export default CountUp;
