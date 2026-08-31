# map-canvas-implementation - Work Plan

## TL;DR (For humans)
<!-- Fill this LAST, after the detailed plan below is written, so it summarizes the REAL plan. -->
<!-- Plain English for a non-engineer: NO file paths, NO todo numbers, NO wave/agent/tool names. -->

**What you'll get:** A fully functional 2D map viewer page that fetches map data from the TUSK API and renders it on an HTML5 Canvas. Users can select a map from a dropdown, zoom in/out with the mouse wheel, pan by dragging, and click on points/lines to see details. The "맵 뷰" menu item will navigate to this page.

**Why this approach:** Following the existing devicemanagement patterns (types/api/page) ensures consistency, reduces bugs, and makes maintenance easier. Native Canvas 2D API gives full control with zero dependencies.

**What it will NOT do:** No external canvas libraries (Three.js/Konva), no WebSocket real-time updates, no path planning, no multi-floor support, no export, no robot overlay, no edit mode.

**Effort:** Short
**Risk:** Low - well-trodden patterns in repo

**Decisions to sanity-check:** Using native Canvas 2D (no library), auto-fit coordinate scaling, industrial color palette for point types, dropdown map selection, pan/zoom/click interactions, 3s rate limit reuse.

Your next move: approve to run `/start-work map-canvas-implementation`. Full execution detail follows below.

---

> TL;DR (machine): Short effort, Low risk, delivers map types + API + canvas 2D page with pan/zoom/select

## Scope
### Must have
- TypeScript types: MapListResponse, MapInfoResponse, MapPoint, MapLine, DataType enum (1,10,40,41,42,50)
- API functions: fetchMapList() → string[], fetchMapInfo(mapName) → {mapDataList: MapPoint[], mapLineList: MapLine[]}
- Map page (src/pages/map/index.tsx): map selector dropdown, canvas rendering, zoom (wheel), pan (drag), click tooltip
- Color-coded points by dataType: 1=gray, 10=green, 40=blue, 41=yellow, 42=orange, 50=purple
- Lines connecting points (nodeStart → nodeEnd)
- Loading/error/retry states matching devicemanagement page
- MenuBar "맵 뷰" click → navigate to /map
- Responsive canvas that fits container

### Must NOT have (guardrails, anti-slop, scope boundaries)
- WebGL/Three.js/Konva or any external canvas library
- Real-time WebSocket updates (HTTP only, like devicemanagement)
- Path planning or route visualization
- Multi-floor/map layer support
- Export/save map image
- Robot/charger overlay on map (separate feature)
- Edit mode for map points/lines

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: none (UI-only feature, no logic seams) + manual QA via browser
- Evidence: .omo/evidence/ulw/<session>/<goalId>/a<attempt>/task-<N>-map-canvas-implementation.png

## Execution strategy
### Parallel execution waves
> Target 5-8 todos per wave. Fewer than 3 (except the final) means you under-split.

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1. Create src/types/map.ts | - | 2, 3 | - |
| 2. Create src/api/map.ts | 1 | 3 | - |
| 3. Implement src/pages/map/index.tsx | 1, 2 | 4 | - |
| 4. Fix MenuBar "맵 뷰" onClick | - | - | 1, 2, 3 |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->
- [ ] 1. Create src/types/map.ts with MapListResponse, MapInfoResponse, MapPoint, MapLine, DataType enum
  What to do / Must NOT do: Define TypeScript interfaces matching the TUSK API spec exactly. Export all types. No runtime code.
  Parallelization: Wave 1 | Blocked by: - | Blocks: 2, 3
  References (executor has NO interview context - be exhaustive): src/types/devicemanagement.ts:1-39 (pattern), API spec in draft Findings
  Acceptance criteria (agent-executable): File exists, exports all 5 types, compiles with `tsc --noEmit`
  QA scenarios (name the exact tool + invocation): happy + failure, Evidence .omo/evidence/ulw/<session>/<goalId>/a<attempt>/task-1-map-canvas-implementation.png
  Commit: Y | feat(types): add map types for TUSK API

- [ ] 2. Create src/api/map.ts with fetchMapList() and fetchMapInfo(mapName)
  What to do / Must NOT do: Follow devicemanagement.ts pattern exactly. Use HTTP_BASE = "/api/rpc/". Apply RATE_LIMIT_MS = 3000. Return typed data. No side effects.
  Parallelization: Wave 1 | Blocked by: 1 | Blocks: 3
  References (executor has NO interview context - be exhaustive): src/api/devicemanagement.ts:1-23 (pattern), src/types/map.ts (types)
  Acceptance criteria (agent-executable): File exists, exports both functions, compiles with `tsc --noEmit`, functions match signatures
  QA scenarios (name the exact tool + invocation): happy + failure, Evidence .omo/evidence/ulw/<session>/<goalId>/a<attempt>/task-2-map-canvas-implementation.png
  Commit: Y | feat(api): add map API functions

- [ ] 3. Implement src/pages/map/index.tsx with canvas 2D map rendering
  What to do / Must NOT do: Full page component. State: mapList, selectedMap, mapInfo, loading, error, canvas ref, transform (scale, offset). Effects: fetch map list on mount. Handler: onMapSelect → fetchMapInfo. Canvas: auto-fit bounds, draw points (color by dataType), draw lines, zoom/pan transform, click hit-test for tooltip. Reuse devicemanagement error/loading/retry pattern. No external libs.
  Parallelization: Wave 2 | Blocked by: 1, 2 | Blocks: -
  References (executor has NO interview context - be exhaustive): src/pages/devicemanagement/index.tsx:1-115 (pattern), src/types/map.ts, src/api/map.ts
  Acceptance criteria (agent-executable): Page renders at /map, dropdown loads map names, selecting map shows canvas with points/lines, wheel zooms, drag pans, click shows tooltip, error/retry works
  QA scenarios (name the exact tool + invocation): happy + failure, Evidence .omo/evidence/ulw/<session>/<goalId>/a<attempt>/task-3-map-canvas-implementation.png
  Commit: Y | feat(map): implement canvas 2D map page

- [ ] 4. Fix MenuBar "맵 뷰" onClick to navigate to /map
  What to do / Must NOT do: Add onClick={() => router('/map')} to the "맵 뷰" SubText in MenuBar. No other changes.
  Parallelization: Wave 1 | Blocked by: - | Blocks: -
  References (executor has NO interview context - be exhaustive): src/components/main/menubar.tsx:1-75 (current code)
  Acceptance criteria (agent-executable): Clicking "맵 뷰" in menu navigates to /map page
  QA scenarios (name the exact tool + invocation): happy + failure, Evidence .omo/evidence/ulw/<session>/<goalId>/a<attempt>/task-4-map-canvas-implementation.png
  Commit: Y | fix(nav): add map view navigation

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [ ] F1. Plan compliance audit
- [ ] F2. Code quality review
- [ ] F3. Real manual QA
- [ ] F4. Scope fidelity

## Commit strategy
Each todo commits independently with conventional commit messages. Squash not required.

## Success criteria
- `npm run build` passes
- `npm run lint` passes
- Page loads at /map, shows map selector, renders canvas correctly
- All interactions work: dropdown, zoom, pan, click tooltip
- MenuBar "맵 뷰" navigates to /map
- No TypeScript errors