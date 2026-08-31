import { MAP_CODE, postCommand } from "./base";

export interface CommandResult {
  success: boolean;
  code: string;
  message: string | null;
}

// ── 명령 계열 (DigitalTwin Manual API 4종) ──────────────────────

/** 수동 이동 (로봇을 목표 지점으로 이동) */
export const moveRobot = (amrId: string, targetNodeCode: string): Promise<CommandResult> =>
  postCommand({
    dataType: "ManualMove",
    mapCode: MAP_CODE,
    amrId,
    targetNodeCode,
  });

/** 수동 랙 이동 (시작 지점 -> 목표 지점) */
export const rackMoveRobot = (
  amrId: string,
  startNodeCode: string,
  targetNodeCode: string,
): Promise<CommandResult> =>
  postCommand({
    dataType: "ManualRackMove",
    mapCode: MAP_CODE,
    amrId,
    startNodeCode,
    targetNodeCode,
  });

/** 충전 지점으로 이동 */
export const chargeRobot = (amrId: string, targetNodeCode: string): Promise<CommandResult> =>
  postCommand({
    dataType: "ManualCharge",
    mapCode: MAP_CODE,
    amrId,
    targetNodeCode,
  });

/** 미션 취소 */
export const cancelMission = (cancelMissionCode: string): Promise<CommandResult> =>
  postCommand({
    dataType: "MissionCancel",
    cancelMissionCode,
  });