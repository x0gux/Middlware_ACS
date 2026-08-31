// ── 로봇 상태 (DigitalTwin AMRInfo = 미들웨어 AMRInformation[]) ──

/** DeviceOperatingMode (byte): 0=MANUAL, 1=AUTOMATIC, 2=SERVICE */
export type OperatingMode = 0 | 1 | 2;

/**
 * TUSK 미들웨어가 내려주는 로봇 1대분 스냅샷.
 * K-MReS 시절의 missionCode/robotType/nodeCode 등은 없고,
 * taskId / agvStat / load 등으로 대체되었다.
 */
export interface RobotStatus {
  robotId: string;
  deviceType: string;
  mapCode: string;
  resolvedMapCode: string;
  x: number;
  y: number;
  robotOrientation: number;
  batteryLevel: number;
  operatingMode: OperatingMode | null;
  offline: boolean;
  driving: boolean;
  paused: boolean;
  fieldViolation: boolean;
  load: boolean;
  agvStat: number | null;
  taskId: string;
}