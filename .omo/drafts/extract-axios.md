---
slug: extract-axios
status: awaiting-approval-consumed
intent: clear
review_required: true
plan_path: .omo/plans/extract-axios.md
plan_sha256: null
review_round_id: null
pending-action: execute plan via /start-work (user approval given twice: "Approve and execute", "let's make file and modify", then explicit /start-work invocation)
approach: 3-layer split (types/api/component) preserving all observable behavior; verified by tsc+vite build
---

# Draft: extract-axios

## Components (topology ledger)

| id | outcome | status | evidence |
| --- | --- | --- | --- |
| C1 types layer | RobotStatus interface isolated | active | src/types/robot.ts |
| C2 api layer | axios call + constants isolated | active | src/api/robot.ts |
| C3 component | App.tsx UI-only | active | src/App.tsx |

## Open assumptions (announced defaults)

| assumption | adopted default | rationale | reversible? |
| --- | --- | --- | --- |
| rate-limit guard 위치 | App.tsx 유지 | 승인된 브리프 그대로, API 모듈은 순수함수 | yes |
| wsColor/wsLabel 미사용 코드 | 유지 | 컴파일 패리티, 관측변화 0 | yes |
| useEffect import | 제거 | 미사용, lint 정리 | yes |

## Findings (cited - path:lines)

- src/App.tsx:4-12 — HTTP_BASE/WS_BASE/ROBOT_IDS/RATE_LIMIT_MS 상수 인라인
- src/App.tsx:16-21 — RobotStatus 인터페이스 인라인
- src/App.tsx:36-57 — fetchRobotStatus에 rate-guard+axios.post+에러처리 혼재
- src/App.tsx:63-64 — wsColor/wsLabel 계산 후 미사용 (원본 그대로 보존 결정)
- package.json:8,15 — build=tsc -b && vite build, axios ^1.19.0 존재
- src/components/main/menubar.tsx — 사용자 별도 작업물, Scope OUT

## Decisions (with rationale)

- 3레이어 분리(types/api/component): 승인된 플랜 준수, hooks 레이어는 추가하지 않음(범위 축소 방지)
- fetchRobotStatus는 data만 반환, 상태 처리는 컴포넌트 소유 — 원본 동작 1:1 보존
- 검증: 테스트 프레임워크 부재 → 빌드 타입체크 + 번들 문자열 grep이 실증 표면

## Scope IN

- src/types/robot.ts 생성, src/api/robot.ts 생성, src/App.tsx 재작성, 빌드 검증

## Scope OUT (Must NOT have)

- 기능 추가/축소, WS 라이프사이클 구현, menubar.tsx·main.tsx·index.css 수정, 신규 의존성

## Open questions

- 없음 (모두 해소)

## Approval gate
status: approved-by-user
<!-- "Approve and execute"(question tool) + "let's make file and modify" + /start-work 명시 호출 -->
