import { default as React } from 'react';
export interface ThemeCard {
    id?: number | string;
    thumbnail?: string;
    title: string;
    tag?: string;
    price?: number | string;
    summary?: string;
    href: string;
    builder?: string;
}
export interface ThemesSectionProps {
    /** 실제 theme 게시판 게시글 + 메타에서 매핑된 카드 목록 */
    posts?: ThemeCard[];
}
declare const ThemesSection: React.FC<ThemesSectionProps>;
export default ThemesSection;
