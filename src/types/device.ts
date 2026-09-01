// 공통 API 응답 인터페이스
export interface ApiResponse<T> {
  ok: boolean;
  error: string | null;
  data: T;
}

// 수정된 로봇 상태 인터페이스 (백엔드 JSON과 1:1 매칭)
export interface RobotStatus {
  id: string;
  deviceType: string;
  x: number;
  y: number;
  theta: number;             // 기존 robotOrientation -> theta
  mapId: string;             // 기존 mapCode -> mapId
  batteryCharge: number;      // 기존 batteryLevel -> batteryCharge
  taskId: string | null;     // null 허용으로 변경
  offline: boolean;
  driving: boolean;
  paused: boolean;
  load: boolean;
}

// 로봇 목록 API 응답 타입
export type RobotStatusListResponse = ApiResponse<RobotStatus[]>;

export interface ChargerStatus {
  id: string;
  mapId?: string | null;
  deviceType?: string | null;
  offline?: boolean | null;
  available?: boolean | null;
  stat?: string | null;
  robotId?: string | null;
  robotSoc?: number | null; // 충전 중인 로봇의 배터리 잔량 (%)
  ip?: string | null;
}

// 충전기 API 호출 전용 파라미터 타입 (필요 시 활용)
export interface FetchChargersParams {
  mapId?: string;
  availableOnly?: boolean;
}