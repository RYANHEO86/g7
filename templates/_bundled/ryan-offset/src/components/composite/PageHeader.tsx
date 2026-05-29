import React from 'react';
import { Section, Div, H1 } from '../basic';

export interface PageHeaderProps {
  /** 페이지 대표 제목 (페이지 명칭) */
  title?: string;
}

/**
 * 공통 페이지 대표 타이틀.
 * 페이지 명칭만 큰 제목으로 표시한다 (eyebrow/lead/breadcrumb 없음).
 * 테마·제작의뢰 등 서브페이지 공통 헤더로 사용.
 */
const PageHeader: React.FC<PageHeaderProps> = ({ title = '' }) => {
  return (
    <Section className="page-title-bar" aria-label="페이지 제목">
      <Div className="aict-layout">
        <H1 className="page-title-bar__title">{title}</H1>
      </Div>
    </Section>
  );
};

export default PageHeader;
