import React, { useEffect, useState } from 'react';
import { Div, Nav, Ul, Li, A, H1, Span, Button } from '../basic';

const G7Core = () => (window as any).G7Core;

export interface OverlayMenuItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface OverlayUser {
  uuid?: string;
  name?: string;
  avatar?: string;
}

export interface OverlayHeaderProps {
  logoLabel?: string;
  logoHref?: string;
  menu: OverlayMenuItem[];
  /** 비로그인 시 노출되는 로그인 링크 */
  loginHref?: string;
  loginLabel?: string;
  /** 마이페이지 링크 (로그인 시 노출) */
  myHref?: string;
  myLabel?: string;
  logoutLabel?: string;
  menuButtonAriaLabel?: string;
  thresholdPx?: number;
  variant?: 'overlay' | 'subpage';
  className?: string;
  /** 로그인된 사용자 정보 — 없으면 비로그인 상태로 간주 (보통 _global.currentUser 바인딩) */
  currentUser?: OverlayUser | null;
}

const EMPTY_MENU: OverlayMenuItem[] = [];

const OverlayHeader: React.FC<OverlayHeaderProps> = ({
  logoLabel = 'Offset Theme',
  logoHref = '/',
  menu = EMPTY_MENU,
  loginHref = '/login',
  loginLabel = '로그인',
  myHref = '/mypage',
  myLabel = 'MY',
  logoutLabel = '로그아웃',
  menuButtonAriaLabel = '전체 메뉴',
  thresholdPx = 60,
  variant = 'overlay',
  className = '',
  currentUser = null,
}) => {
  const [solid, setSolid] = useState(variant === 'subpage');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (variant === 'subpage') { setSolid(true); return; }
    const onScroll = () => setSolid(window.scrollY > thresholdPx);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [thresholdPx, variant]);

  const typeClass = variant === 'subpage' ? 'type-subpage' : 'type-overlay';
  const headerClass = [typeClass, solid ? 'is-solid' : '', className].filter(Boolean).join(' ');

  const isLoggedIn = !!currentUser?.uuid;

  const handleLogout = () => {
    const core = G7Core();
    if (core?.dispatch) {
      core.dispatch({ handler: 'logout' });
    } else if (typeof window !== 'undefined') {
      window.location.href = '/logout';
    }
  };

  return (
    <Div id="aict-top-layout" className={headerClass} role="banner">
      <Div className="top_wrap">
        <H1 className="logo_wrap" id="logo">
          <A href={logoHref} className="logo-link" aria-label={`${logoLabel} 홈`}>
            <Span className="blind">{logoLabel}</Span>
          </A>
        </H1>

        <Nav className="gnb" aria-label="주요 메뉴">
          <Ul className="gnb-list">
            {menu.map((m, i) => (
              <Li key={i}>
                <A href={m.href} aria-current={m.active ? 'page' : undefined}>
                  {m.label}
                </A>
              </Li>
            ))}
          </Ul>
        </Nav>

        <Ul className="utile_wrap">
          {isLoggedIn ? (
            <>
              <Li className="util-login">
                <A href={myHref} className="login-btn" aria-label={`${currentUser?.name ?? ''} ${myLabel}`}>
                  {currentUser?.name ? `${currentUser.name} ${myLabel}` : myLabel}
                </A>
              </Li>
              <Li className="util-login">
                <Button
                  type="button"
                  className="login-btn"
                  onClick={handleLogout}
                  aria-label={logoutLabel}
                >
                  {logoutLabel}
                </Button>
              </Li>
            </>
          ) : (
            <Li className="util-login">
              <A href={loginHref} className="login-btn">{loginLabel}</A>
            </Li>
          )}
          <Li className="util-menu">
            <A href="#" className="ico-btn" aria-label={menuButtonAriaLabel} />
          </Li>
        </Ul>
      </Div>
    </Div>
  );
};

export default OverlayHeader;
