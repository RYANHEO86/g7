import React, { useEffect } from 'react';

export interface RevealScrollManagerProps {
  /** 관찰 대상 셀렉터 — 기본 `.aict-home .reveal` */
  selector?: string;
  rootMargin?: string;
  threshold?: number;
}

/**
 * 페이지 내 모든 `.reveal` 요소에 IntersectionObserver를 부착해
 * viewport 진입 시 `.is-in-view` 클래스를 토글한다.
 * 정적 마크업의 .reveal 요소 (RevealOnScroll wrapper 미사용)에도 페이드인 적용.
 */
const RevealScrollManager: React.FC<RevealScrollManagerProps> = ({
  selector = '.aict-home .reveal',
  rootMargin = '0px 0px -10% 0px',
  threshold = 0.08,
}) => {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document.querySelectorAll(selector).forEach((el) => el.classList.add('is-in-view'));
      return;
    }
    let io: IntersectionObserver | null = null;
    const observed = new WeakSet<Element>();
    const attach = () => {
      if (!io) {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add('is-in-view');
                io?.unobserve(e.target);
              }
            });
          },
          { rootMargin, threshold },
        );
      }
      document.querySelectorAll(selector).forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          io!.observe(el);
        }
      });
    };
    // 초기 1회 + 짧은 지연 후 1회 더 (sibling 컴포넌트 mount 대비) + MutationObserver
    attach();
    const t1 = window.setTimeout(attach, 100);
    const t2 = window.setTimeout(attach, 500);
    const mo = new MutationObserver(() => attach());
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      mo.disconnect();
      io?.disconnect();
    };
  }, [selector, rootMargin, threshold]);

  return null;
};

export default RevealScrollManager;
