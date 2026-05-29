#!/usr/bin/env bash
# 그누보드7 SessionStart hook — 세션 시작 시 핵심 작업 규칙을 컨텍스트에 주입한다.
# stdout 전체가 Claude의 컨텍스트에 추가된다.
cat <<'EOF'
[그누보드7 세션 규칙 — 자동 주입됨]
이 프로젝트는 Laravel 12 + React 19 기반의 신규 CMS다. 일반 Laravel/React 추측은 대부분 틀린다.
- 모든 작업(레이아웃/기능/수정/버그) 전에 관련 docs를 먼저 Read 하라. 추측 금지.
- 작업유형 → 문서 지도: CLAUDE.md 와 docs/README.md 에 있다.
- 화면 = JSON 레이아웃(layouts/*.json, extends + slots) + React. 활성 사용자 템플릿은 타입당 1개이며, 활성 템플릿에 없는 라우트 레이아웃은 코어 기본으로 fallback 된다.
- 절대 금지 패턴은 AGENTS.md 의 "CRITICAL RULES" 참조.
- 완료 전 /g7-validate-frontend 또는 /g7-validate-backend 로 검증하고, 테스트를 실제로 통과시켜라 (작성만으로는 미완료).
- 런타임 레이아웃/상태 버그는 DevTools MCP(g7-state, g7-diagnose 등)로 실제 상태를 확인하라.
EOF
exit 0
