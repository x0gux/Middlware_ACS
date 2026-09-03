import axios from "axios";
import type { ThirdPartyDataType } from "../types/base";

// ── Server config ──────────────────────────────────────────────
export const HTTP_BASE = "/api";
export const MAP_CODE = "Demo";
export const RATE_LIMIT_MS = 3000;

// 백엔드 공통 응답 인터페이스
export interface ApiResponse<T = unknown> {
  ok: boolean;
  error: string | null;
  data: T;
}

// Helper: URL 경로 슬래시 정리
const buildUrl = (endpoint: string) => {
  const cleanBase = HTTP_BASE.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  return `${cleanBase}/${cleanEndpoint}`;
};

// ── 공통 요청 헬퍼 ─────────────────────────────────────────────

/**
 * 1. 조회 계열: ok 검증 후 data만 반환
 * @param endpoint 요청할 하위 경로 (예: 'thirdparty/robots')
 * @param payload 요청 바디 데이터
 */
export async function postThirdparty<T>(
  endpoint: string,
  payload: Record<string, unknown> & { dataType?: ThirdPartyDataType } = {}
): Promise<T> {
  const res = await axios.post<ApiResponse<T>>(
    buildUrl(endpoint),
    payload
  );

  if (!res.data.ok) {
    throw new Error(res.data.error || '알 수 없는 API 에러가 발생했습니다.');
  }
  return res.data.data;
}

/**
 * 2. 명령 계열: ok 검증 후 성공 여부, 에러 메시지, 응답 데이터 반환
 * @param endpoint 요청할 하위 경로 (예: 'thirdparty/tasks/create')
 * @param payload 요청 바디 데이터
 */
export async function postCommand<T = unknown>(
  endpoint: string,
  payload: Record<string, unknown> = {}
): Promise<{ success: boolean; message: string | null; data?: T }> {
  const res = await axios.post<ApiResponse<T>>(
    buildUrl(endpoint),
    payload
  );

  return {
    success: res.data.ok,
    message: res.data.error,
    data: res.data.data,
  };
}
