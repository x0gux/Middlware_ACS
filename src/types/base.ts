// ── 서버/공통 설정 ────────────────────────────────────────────
export const HTTP_BASE = "/api";

// TUSK 미들웨어의 ThirdParty 서버로 프록시되는 경로 (vite.config.ts 참조)
// 실제 요청: POST {HTTP_BASE}  ->
export const MAP_CODE = "Demo";

// 수동 명령 간 최소 간격(ms) — rate-limit 가드
export const RATE_LIMIT_MS = 3000;

// ── ThirdParty API 공통 응답 봉투 ─────────────────────────────
export interface ThirdPartyResponse<T> {
  code: string;
  message: string | null;
  success: boolean;
  data: T;
}

// ── ThirdParty API dataType (미들웨어 ThirdPartyDataType 12종) ──
export type ThirdPartyDataType =
  | "ChargerInfo"
  | "ChargerIdInfo"
  | "AlarmInfo"
  | "MapInfo"
  | "StorageInfo"
  | "ContainerInfo"
  | "TaskInfo"
  | "RobotInfo"
  | "RobotIdInfo"
  ;