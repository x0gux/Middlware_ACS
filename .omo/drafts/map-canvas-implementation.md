---
slug: map-canvas-implementation
status: drafting
intent: clear
review_required: false
pending-action: write .omo/plans/map-canvas-implementation.md
approach: Implement map types, API functions, and canvas-based 2D map rendering following existing patterns in the codebase (devicemanagement types/api and page)
---

# Draft: map-canvas-implementation

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->
map-types | TypeScript interfaces for MapListResponse, MapInfoResponse, MapPoint, MapLine, DataType enum | active | src/types/devicemanagement.ts:1-39
map-api | API functions fetchMapList(), fetchMapInfo(mapName) using axios with existing HTTP_BASE and rate limiting | active | src/api/devicemanagement.ts:1-23
map-page | React component at src/pages/map/index.tsx with canvas 2D rendering, map selector dropdown, zoom/pan controls | active | src/pages/map/index.tsx (empty)

## Open assumptions (announced defaults)
<!-- Intent is CLEAR: ask only genuine owner-decisions. Record any default you adopt instead of asking, so the user can veto it at the gate. -->
<!-- assumption | adopted default | rationale | reversible? -->
Canvas rendering approach | Use HTML5 Canvas 2D API directly (no external library) | Matches "canvas 기능을 이용해 2d로 구현" request; zero dependencies; full control | Yes - can swap to Konva/Three.js later
Coordinate system | Assume API coordinates are in meters, scale to canvas pixels with auto-fit | Typical for robot maps; user didn't specify units | Yes - can add unit config later
Point type visualization | Color-code by dataType: 1=gray, 10=green, 40=blue, 41=yellow, 42=orange, 50=purple | Standard industrial mapping colors; no user spec | Yes - easily customizable
Map selection | Dropdown to select from fetched map list, then fetch details | Natural UX flow; matches API design | Yes - can add auto-load first map
Interaction | Pan (drag), zoom (wheel), click point for info tooltip | Standard map interactions; minimal but useful | Yes - can extend with more tools
Error handling | Reuse existing pattern: loading state, error message, retry button | Consistent with devicemanagement page | Yes
Rate limiting | Reuse RATE_LIMIT_MS = 3000 from devicemanagement | Same backend, same protection needed | Yes

## Findings (cited - path:lines)
- Project uses file-based routing via vite-plugin-pages (vite.config.ts:9-11)
- API proxy forwards /api to http://192.168.0.170:7777 (vite.config.ts:14-20)
- Existing API pattern: axios.post to HTTP_BASE + endpoint, returns res.data.data (src/api/devicemanagement.ts:15-17)
- Existing types pattern: interfaces matching API response shape (src/types/devicemanagement.ts:3-39)
- Existing page pattern: useState for data/loading/error, useCallback for fetch, manual refresh button (src/pages/devicemanagement/index.tsx:7-39)
- MenuBar has "맵 뷰" item but no onClick handler (src/components/main/menubar.tsx:12)
- Map page exists but is empty (src/pages/map/index.tsx:0)
- HTTP_BASE = "/api/rpc/" (src/api/devicemanagement.ts:5) - so map endpoints will be /api/rpc/map/list and /api/rpc/map/info

## Decisions (with rationale)
1. Create src/types/map.ts for map-related types (following devicemanagement pattern)
2. Create src/api/map.ts for map API functions (following devicemanagement pattern)
3. Implement src/pages/map/index.tsx with canvas rendering
4. Add onClick handler to "맵 뷰" in MenuBar to navigate to /map (currently missing)
5. Use the existing rate limiting and error handling patterns

## Scope IN
- TypeScript types for: MapListResponse, MapInfoResponse, MapPoint, MapLine, DataType enum
- API functions: fetchMapList(), fetchMapInfo(mapName: string)
- Map page with: map selector dropdown, canvas 2D rendering, zoom/pan, point/line rendering with color coding by type, tooltip on click
- Navigation fix: MenuBar "맵 뷰" click handler
- Responsive canvas that fits container

## Scope OUT (Must NOT have)
- WebGL/Three.js/Konva or any external canvas library
- Real-time WebSocket updates (HTTP only, like devicemanagement)
- Path planning or route visualization
- Multi-floor/map layer support
- Export/save map image
- Robot/charger overlay on map (separate feature)
- Edit mode for map points/lines

## Open questions
- None - all decisions have defensible defaults based on existing patterns and user spec

## Approval gate
status: awaiting-approval
<!-- When exploration is exhausted and unknowns are answered, set status: awaiting-approval. -->
<!-- That durable record is the loop guard: on a later turn read it and resume at the gate instead of re-running exploration. -->