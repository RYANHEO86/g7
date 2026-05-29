import { default as React } from 'react';
export interface ContactQuestion {
    id: number | string;
    title: string;
    category?: string;
    status?: string;
    created_at?: string;
    href?: string;
}
export interface ContactSectionProps {
    /** 로그인 여부 */
    loggedIn?: boolean;
    /** 로그인 사용자 본인의 문의 글 목록 */
    questions?: ContactQuestion[];
    /** 새 문의 작성 경로 */
    writeHref?: string;
    /** 로그인 경로 */
    loginHref?: string;
    /** 제작 상담(제작의뢰) 경로 */
    inquiryHref?: string;
}
declare const ContactSection: React.FC<ContactSectionProps>;
export default ContactSection;
