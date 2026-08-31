import axios from "axios";
import type { DigitalTwinDataType, DigitalTwinResponse } from "../types/base";

// ── Server config ──────────────────────────────────────────────
export const HTTP_BASE = "/api/";

// TUSK 미들웨어의 DigitalTwin 서버로 프록시되는 경로 (vite.config.ts 참조)

export const MAP_CODE = "Demo";

// 수동 명령 간 최소 간격(ms) — rate-limit 가드
export const RATE_LIMIT_MS = 3000;

// ── 공통 요청 헬퍼 ─────────────────────────────────────────────

// 조회 계열: success/code 검증 후 data만 반환
export async function postDigitalTwin<T>(
  payload: Record<string, unknown> & { dataType: DigitalTwinDataType },
): Promise<T> {
  const res = await axios.post<DigitalTwinResponse<T>>(HTTP_BASE, payload);
  if (!res.data.success || res.data.code !== "200") {
    throw new Error(res.data.message || `API Error: Code ${res.data.code}`);
  }
  return res.data.data;
}

// 명령 계열: data가 null인 대신 success/code/message만 반환
export async function postCommand(
  payload: Record<string, unknown> & { dataType: DigitalTwinDataType },
): Promise<{ success: boolean; code: string; message: string | null }> {
  const res = await axios.post<DigitalTwinResponse<unknown>>(HTTP_BASE, payload);
  return {
    success: res.data.success,
    code: res.data.code,
    message: res.data.message,
  };
}