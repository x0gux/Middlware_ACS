import { postCommand } from "./base";

export interface CommandResult {
  success: boolean;
  message: string | null;
}

// C# 미들웨어 CreateTaskRequest 바디 타입
export interface CreateTaskPayload {
  targets: string[];          // 최소 1개 이상의 목적지 노드/위치 ID
  robotId?: string;           // 특정 로봇 지정
  priority?: number;          // 우선순위
  configId?: string;          // 작업 설정 ID
  containerId?: string;       // 용기 ID
  containerTypeId?: string;   // 용기 타입 ID
}

// ── 명령 계열 (C# ThirdParty Tasks/Control API 연동) ──────────────────

/** 1. 수동 이동 (목표 노드로 이동 작업 생성) */
export const moveRobot = (
  amrId: string,
  targetNodeCode: string
): Promise<CommandResult> =>
  postCommand("thirdparty/tasks/create", {
    robotId: amrId,
    targets: [targetNodeCode],
  });

/** 2. 수동 랙 이동 (경로/목적지 포함 이동 작업 생성) */
export const rackMoveRobot = (
  amrId: string,
  startNodeCode: string,
  targetNodeCode: string,
  configId?: string
): Promise<CommandResult> =>
  postCommand("thirdparty/tasks/create", {
    robotId: amrId,
    targets: [startNodeCode, targetNodeCode],
    configId: configId || "RACK_MOVE",
  });

/** 3. 충전 지점으로 이동 (충전기 노드로 작업 생성) */
export const chargeRobot = (
  amrId: string,
  targetNodeCode: string
): Promise<CommandResult> =>
  postCommand("thirdparty/tasks/create", {
    robotId: amrId,
    targets: [targetNodeCode],
    configId: "CHARGE",
  });

/** 4. 작업/미션 취소 (CancelTaskHandler 연동) */
export const cancelMission = (taskId: string): Promise<CommandResult> =>
  postCommand("thirdparty/tasks/cancel", {
    taskId,
  });

/** 5. 화재 제어 신호 전달 (FireControlHandler 연동) */
export const sendFireControl = (
  areaId: string,
  level: number
): Promise<CommandResult> =>
  postCommand("thirdparty/fire/control", {
    areaId,
    level,
  });