import React from 'react';
import { Span } from '../basic';

/**
 * 테마 호환 빌더 배지.
 * 빌더 코드 → 라벨 + 대표색 매핑 (미래 빌더 추가 시 여기만 확장).
 * 색은 인라인 style 로 적용해 빌더별로 자동 분기.
 */
const BUILDER_MAP: Record<string, { label: string; color: string }> = {
  rebuilder: { label: '리빌더', color: '#AA20FF' },
  gnuboard5: { label: '그누보드5', color: '#2D8CFF' },
  amina: { label: '아미나빌더', color: '#FF7A00' },
};

export interface BuilderBadgeProps {
  /** 빌더 코드 (rebuilder | gnuboard5 | amina ...) */
  builder?: string;
  className?: string;
}

const BuilderBadge: React.FC<BuilderBadgeProps> = ({ builder = 'rebuilder', className = '' }) => {
  const info = BUILDER_MAP[builder] ?? BUILDER_MAP.rebuilder;
  const cls = ['builder-badge', className].filter(Boolean).join(' ');

  return (
    <Span
      className={cls}
      style={{
        color: info.color,
        backgroundColor: `${info.color}1A`,
        borderColor: `${info.color}40`,
      }}
    >
      <Span className="builder-badge__dot" style={{ backgroundColor: info.color }} aria-hidden="true" />
      {info.label} 전용
    </Span>
  );
};

export default BuilderBadge;
