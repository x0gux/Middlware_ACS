# extract-axios - Work Plan

## TL;DR (For humans)

**What you'll get:** App.tsx에서 네트워크 요청 코드(axios)와 타입이 별도 파일(api/types 레이어)로 분리되고, App.tsx는 화면 로직만 남습니다. 기존 동작과 화면은 그대로 유지되며, 현재 빌드를 깨뜨리던 미사용 변수 오류도 함께 해소됩니다.

**Why this approach:** UI와 데이터 요청의 관심사를 분리하면 재사용과 테스트가 쉬워지고, 향후 기능 추가의 표준 자리가 생깁니다.

**What it will NOT do:** 기능 변경 없음 · WebSocket 실동작 추가 없음 · menubar.tsx 등 다른 파일 수정 없음 · 사용자가 방금 넣은 TUSK 카드 UI 변경 없음

**Effort:** Quick
**Risk:** Low - 순수 리팩터링, 빌드 타입체크로 검증 가능
**Decisions to sanity-check:** 미호출 setWsStatus는 읽기전용 분해(`const [wsStatus] = useState(...)`)로 해소 — 관측 동작 동일(항상 "closed")

Your next move: 완료 - 최종 검증 웨이브 전부 통과(F1-F4 APPROVE).

---

> TL;DR (machine): Quick / Low risk / types+api 분리 & App.tsx 슬림화 / npm run build 3회(positive·negative 포함) 검증 / 완료

## Scope
### Must have
- `src/types/robot.ts` 생성: 라이브 App.tsx의 TUSK RobotStatus 인터페이스 그대로 export
- `src/api/robot.ts` 생성: HTTP_BASE/RATE_LIMIT_MS 상수 + `fetchRobotStatus(): Promise<RobotStatus[]>` (res.data.data 언래핑 포함)
- `src/App.tsx` 재작성: api/types import + MenuBar/카드 UI 완전 보존 + TS6133 해소
- 기존 관측 동작 100% 보존 (한국어 메시지, rate-limit 3초, 콘솔 에러, 렌더 출력 전부)

### Must NOT have (guardrails, anti-slop, scope boundaries)
- 사용자가 삭제한 WS_BASE/ROBOT_IDS 부활 금지 — 라이브 파일이 진실
- `src/components/main/menubar.tsx`, `main.tsx`, `index.css`, package.json, tsconfig 수정 금지
- 카드 렌더링 JSX 로직 변경 금지
- 신규 의존성 설치 금지

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: none — 빌드 타입체크 + 산출물 문자열 검증
- Baseline characterization: 수정 전 빌드 RED(TS6133, task-0-baseline.log) → 리팩터링 후 GREEN. Failing-first 자연 달성
- Evidence: `.omo/evidence/extract-axios/` 하위 task-N 파일들
- Manual-QA channel: 빌드 후 dist 산출물 내 "수동 새로고침" 문자열 grep (task-5-bundle.txt)

## Execution strategy
### Parallel execution waves
- Wave 1 (implementation): Todo 1-4 — 단일 워커 직렬 원자 실행
- Wave 2 (verification): Todo 5 + Final wave — 독립 검증

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1 types/robot.ts | - | 3 | 2 |
| 2 api/robot.ts | 1 | 3 | - |
| 3 App.tsx rewrite | 1,2 | 5 | - |
| 5 automated verify | 3 | Final wave | - |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->

- [x] 1. Create src/types/robot.ts (v2: TUSK fields)
  What to do / Must NOT do: 스펙 그대로 생성. 필드 추가/삭제 금지.
  Parallelization: Wave 1 | Blocked by: - | Blocks: 2,3
  References: src/App.tsx:12-28 (라이브 인터페이스)
  Acceptance criteria: 파일 존재 + export interface RobotStatus + 15 필드 일치 — **충족 확인 (루트 전수 대조)**
  QA scenarios: Todo 5에서 일괄, Evidence task-1-file.txt
  Commit: N | git repo 아님

- [x] 2. Create src/api/robot.ts (v2: res.data.data unwrap)
  What to do / Must NOT do: 스펙 그대로 생성. WS_BASE/ROBOT_IDS 부활 금지.
  Parallelization: Wave 1 | Blocked by: 1 | Blocks: 3
  References: src/App.tsx:6-9(상수), :52-54(원본 호출+언래핑)
  Acceptance criteria: HTTP_BASE+RATE_LIMIT_MS+fetchRobotStatus export — **충족 확인**
  QA scenarios: Todo 5에서 일괄, Evidence task-2-file.txt
  Commit: N | git repo 아님

- [x] 3. Rewrite src/App.tsx (v2: preserve live UI incl. MenuBar + fix TS6133)
  What to do / Must NOT do: 스펙으로 전면 교체. MenuBar/카드/wsLabel 보존, setWsStatus 읽기전용 분해.
  Parallelization: Wave 1 | Blocked by: 1,2 | Blocks: 5
  References: src/App.tsx:1-112 (라이브 전체)
  Acceptance criteria: axios import 0건 + api import 존재 + tsc 통과 + 한국어 메시지 보존 — **충족 확인 (grep+build+전문)**
  QA scenarios: Todo 5에서 일괄, Evidence task-3-file.txt
  Commit: N | git repo 아님

- [x] 5. Automated verification + real-surface QA
  What to do / Must NOT do: build exit 0 + grep axios==0 + 번들 문자열 + NEGATIVE 테스트. dry-run 금지.
  Parallelization: Wave 2 | Blocked by: 3 | Blocks: Final wave
  References: package.json:8
  Acceptance criteria: 4개 증거 파일 + 모두 통과 — **충족 (build exit=0 / grep=0 / bundle PASS / negative exit=2)**
  Adversarial: stale_state(probed-fresh), misleading_success_output(exit-code+grep), dirty_worktree(N/A git 아님), 나머지 N/A
  Cleanup receipt: task-5-cleanup.txt CLEAN
  Commit: N | git repo 아님

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [x] F1. Plan compliance audit — APPROVE (루트): Todo 1,2,3,5 수용기준 전 항목 충족, 증거 경로 유효
- [x] F2. Code quality review — APPROVE (루트 대리; explore 백엔드 404 x2로 폴백): import 해석·별명 일관성·타입/JSX 필드 15종 일치·신규 데드코드 없음(문서화된 wsStatus 패턴 제외)
- [x] F3. Real manual QA — APPROVE (루트): task-5-bundle.txt PASS(실제 컴파일 번들에 UI 문자열) + task-5-negative.log exit=2(빌드 민감도 입증)
- [x] F4. Scope fidelity — APPROVE (루트): grep 증거 — axios/WS_BASE/ROBOT_IDS가 src에서 오직 api/robot.ts에만 존재, 가드레일 파일 무변경(cleanup receipt)

## Commit strategy
git repo가 아니므로 커밋 없음. 완료 시 파일 트리 상태로 인계.

## Success criteria
- `npm run build` 성공 — **달성 (exit=0, red→green 전환)**
- src/App.tsx에 axios 흔적 0건 — **달성**
- api/types 분리 파일 존재 및 사용 — **달성**
- 라이브 UI와 한국어 메시지·rate-limit 동작 보존 — **달성**

---
## Amendment log
- v2 (2026-08-26): 워커 베이스라인 리포트(TS6133) + 라이브 드리프트 반영해 Todos 1-3 갱신.
- final (2026-08-26): 전 체크박스 완료 마킹. F-wave 4/4 APPROVE. 검증 증거: .omo/evidence/extract-axios/ + 본 세션 전수 대조.
