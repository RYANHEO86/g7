import React, { useState } from 'react';
import { Div, Ul, Li, Button, Img } from '../basic';

export interface ThemeGalleryViewerProps {
  /** 갤러리 이미지 URL 배열 */
  images?: string[];
  /** 메인 이미지 대체 텍스트 */
  alt?: string;
}

const EMPTY: string[] = [];

/**
 * 테마 상세 페이지 갤러리.
 * 메인 큰 이미지 1장 + 하단 썸네일 4개. 썸네일 클릭 시 메인 이미지 교체.
 */
const ThemeGalleryViewer: React.FC<ThemeGalleryViewerProps> = ({
  images = EMPTY,
  alt = '테마 미리보기',
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  if (images.length === 0) return null;

  return (
    <Div className="gallery">
      <figure className="gallery__main">
        <Img id="gallery-main-img" src={images[activeIdx]} alt={alt} />
      </figure>
      <Ul className="gallery__thumbs" role="tablist" aria-label="이미지 갤러리">
        {images.map((src, i) => (
          <Li key={i}>
            <Button
              type="button"
              className={`gallery__thumb${i === activeIdx ? ' is-active' : ''}`}
              data-src={src}
              aria-label={`이미지 ${i + 1}`}
              aria-selected={i === activeIdx}
              onClick={() => setActiveIdx(i)}
            >
              <Img src={src} alt="" />
            </Button>
          </Li>
        ))}
      </Ul>
    </Div>
  );
};

export default ThemeGalleryViewer;
