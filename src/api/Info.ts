import { MAP_CODE, postDigitalTwin } from "./base";
import type { ConnectionInfo } from "../types/connection";
import type { LineInfo, NodeInfo, EdgeInfo } from "../types/node";
import type { RobotStatus } from "../types/device";
import type { WorkingStatus } from "../types/work";

// ── 조회 계열 (DigitalTwin Info API 9종) ────────────────────────

/** 대외 연결 상태 (data는 1개짜리 배열) */
export const fetchConnectionInfo = () =>
  postDigitalTwin<ConnectionInfo[]>({ dataType: "StorageInfo" });

/** 라인 PLC 신호/스토리지 상태 (data는 1개짜리 배열) */
export const fetchLineInfo = () =>
  postDigitalTwin<LineInfo[]>({ dataType: "LineInfo", mapCode: MAP_CODE });

/** 로봇 목록 (AMRInformation[]) */
export const fetchRobotStatus = () =>
  postDigitalTwin<RobotStatus[]>({ dataType: "AMRInfo", mapCode: MAP_CODE });

/** 노드 목록 (NodeInformation[]) */
export const fetchNodeStatus = () =>
  postDigitalTwin<NodeInfo[]>({ dataType: "StorageInfo", mapCode: MAP_CODE });

/** 엣지 목록 (EdgeInformation[]) */
export const fetchEdgeStatus = () =>
  postDigitalTwin<EdgeInfo[]>({ dataType: "EdgeInfo", mapCode: MAP_CODE });

/** 수행 중 작업 (WorkingList) */
export const fetchWorkSection = () =>
  postDigitalTwin<WorkingStatus[]>({ dataType: "WorkingInfo", mapCode: MAP_CODE });

/** 대기 중 작업 (MissionList) */
export const fetchMissionSection = () =>
  postDigitalTwin<WorkingStatus[]>({ dataType: "MissionInfo", mapCode: MAP_CODE });

/** 예약된 작업 (ReservationList) */
export const fetchReservationSection = () =>
  postDigitalTwin<WorkingStatus[]>({ dataType: "ReservationInfo", mapCode: MAP_CODE });