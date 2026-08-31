// ── 작업(미션) 정보 (DigitalTwin WorkingInfo/MissionInfo/ReservationInfo) ──
// 세 조회는 공통으로 AMRWorkingDictionary[{ Key, Value }] 를 내려준다.

/** WorkingType (byte): 0=Auto, 1=Manual */
export type WorkingType = 0 | 1;

/**
 * 미들웨어 AMRWorkingContents (TUSK TaskCreate 기준).
 * K-MReS 시절의 missionData/robotIds/missionType/containerCode/templateCode 는
 * targets/configId/containerId/robotId 로 대체되었다.
 */
export interface WorkingContents {
  line: string;
  rack: string;
  workingType: WorkingType;
  priority: number | null;
  targets: string[];
  configId: string;
  containerId: string;
  containerTypeId: number | null;
  robotId: string;
  robotGroup: string;
  lockRobotAfterFinish: boolean;
  unlockRobotId: string;
  errorCode: string;
  taskId: string;
}

/** AMRWorkingDictionary 항목 */
export interface WorkingStatus {
  Key: string;
  Value: WorkingContents;
}