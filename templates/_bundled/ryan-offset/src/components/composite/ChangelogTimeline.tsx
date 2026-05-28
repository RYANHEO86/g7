import React from 'react';
import { Div, Ol, Ul, Li, Span, H3 } from '../basic';

export interface ChangelogEntry {
  version: string;
  date: string;
  /** 변경 사항 글머리표 배열 */
  changes: string[];
}

export interface ChangelogTimelineProps {
  title?: string;
  entries?: ChangelogEntry[];
}

const EMPTY: ChangelogEntry[] = [];

/**
 * 테마 상세 페이지의 업데이트 히스토리 타임라인.
 * 버전별로 changes 배열을 글머리표로 렌더.
 */
const ChangelogTimeline: React.FC<ChangelogTimelineProps> = ({
  title = '업데이트 히스토리',
  entries = EMPTY,
}) => {
  if (entries.length === 0) return null;
  return (
    <>
      <H3 className="detail-body__h">{title}</H3>
      <Ol className="changelog">
        {entries.map((e, i) => (
          <Li key={i} className="changelog__item">
            <Div className="changelog__head">
              <Span className="changelog__ver">{e.version}</Span>
              <time className="changelog__date" dateTime={e.date}>
                {e.date}
              </time>
            </Div>
            <Ul className="changelog__list">
              {e.changes.map((c, j) => (
                <Li key={j}>{c}</Li>
              ))}
            </Ul>
          </Li>
        ))}
      </Ol>
    </>
  );
};

export default ChangelogTimeline;
