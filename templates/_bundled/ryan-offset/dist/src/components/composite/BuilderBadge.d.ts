import { default as React } from 'react';
export interface BuilderBadgeProps {
    /** 빌더 코드 (rebuilder | gnuboard5 | amina ...) */
    builder?: string;
    className?: string;
}
declare const BuilderBadge: React.FC<BuilderBadgeProps>;
export default BuilderBadge;
