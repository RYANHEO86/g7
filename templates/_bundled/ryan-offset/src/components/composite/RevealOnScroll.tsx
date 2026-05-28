import React, { useEffect, useRef, useState } from 'react';
import { Div } from '../basic';

export interface RevealOnScrollProps {
  delay?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  children?: React.ReactNode;
}

/**
 * 스크롤 진입 시 페이드인 (.reveal + .is-in-view 토글)
 * IntersectionObserver 기반, 1회 발화 후 unobserve.
 * 미지원 환경에서는 즉시 is-in-view 적용 (fallback).
 */
const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  delay,
  className = '',
  rootMargin = '0px 0px -10% 0px',
  threshold = 0.08,
  children,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold]);

  const composed = [
    'reveal',
    delay ? `reveal--delay-${delay}` : '',
    inView ? 'is-in-view' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Div className={composed} ref={ref}>
      {children}
    </Div>
  );
};

export default RevealOnScroll;
