#!/usr/bin/env bash
# 그누보드7 UserPromptSubmit hook — 매 요청마다 "docs 먼저" 원칙을 주입한다.
# stdin 으로 {"prompt": "...", ...} JSON 이 들어온다. stdout 은 컨텍스트에 추가된다.
# 노이즈를 줄이기 위해, 구현/수정 의도가 보이는 프롬프트에만 리마인더를 출력한다.

input="$(cat)"

# prompt 텍스트만 추출 (jq 있으면 사용, 없으면 원문 사용)
if command -v jq >/dev/null 2>&1; then
  prompt="$(printf '%s' "$input" | jq -r '.prompt // empty' 2>/dev/null)"
else
  prompt="$input"
fi

# 작업(코드/레이아웃/설정 변경) 신호 키워드
if printf '%s' "$prompt" | grep -qiE '레이아웃|컴포넌트|게시판|모듈|플러그인|템플릿|마이그레이션|컨트롤러|핸들러|만들|추가|수정|고쳐|구현|바꿔|변경|버그|에러|안 ?돼|안 ?나|layout|component|module|plugin|template|migration|controller|handler|create|add|fix|implement|change|bug|error'; then
  cat <<'EOF'
[작업 전 체크 — 자동 리마인더] 코드/레이아웃/설정을 만들거나 고치기 전에:
1) 작업 유형을 판별하고 2) CLAUDE.md 의 "작업유형 → 필수 문서 지도"에서 해당 docs 를 실제로 Read 했는지 확인하라.
docs/AGENTS.md 에 정의되지 않은 문법/핸들러/props 는 존재하지 않는 것으로 간주하고 쓰지 마라(추측 금지).
EOF
fi

exit 0
