import { default as React } from 'react';
export interface PageHeaderProps {
    /** 페이지 대표 제목 (페이지 명칭) */
    title?: string;
}
/**
 * 공통 페이지 대표 타이틀.
 * 페이지 명칭만 큰 제목으로 표시한다 (eyebrow/lead/breadcrumb 없음).
 * 테마·제작의뢰 등 서브페이지 공통 헤더로 사용.
 */
declare const PageHeader: React.FC<PageHeaderProps>;
export default PageHeader;
