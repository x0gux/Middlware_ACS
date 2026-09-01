import { MAP_CODE, postDigitalTwin } from "./base";
import type { ConnectionInfo } from "../types/connection";
import type { LineInfo, NodeInfo, EdgeInfo } from "../types/node";
import type { RobotStatus, ChargerStatus, ApiResponse } from "../types/device";
import type { TaskDto } from "../types/work";

// ── C# 미들웨어 엔드포인트 연동 (ThirdParty Handlers) ──────────────

/** 대외 연결 및 스토리지 상태 (Path: "thirdparty/storage") */
export const fetchConnectionInfo = () =>
  postDigitalTwin<ConnectionInfo[]>('thirdparty/storage');

/** 라인 PLC / 스토리지 상태 (Path: "thirdparty/storage") */
export const fetchLineInfo = () =>
  postDigitalTwin<LineInfo[]>('thirdparty/storage');

/** 로봇 목록 조회 (Path: "thirdparty/robots") */
export const fetchRobotStatus = () =>
  postDigitalTwin<RobotStatus[]>('thirdparty/robots');


export const fetchDeviceStatus = async () => {
  const [robots, chargers] = await Promise.all([
    postDigitalTwin<RobotStatus[]>('thirdparty/robots'),
    postDigitalTwin<ChargerStatus[]>('thirdparty/chargers'),
  ]);

  return {
    robots: robots ?? [],
    chargers: chargers ?? [],
  };
};
/** 맵 상세 정보를 통한 노드 목록 (Path: "thirdparty/maps/info") */
export const fetchNodeStatus = () =>
  postDigitalTwin<NodeInfo[]>('thirdparty/maps/info', { mapName: MAP_CODE });

/** 맵 상세 정보를 통한 엣지 목록 (Path: "thirdparty/maps/info") */
export const fetchEdgeStatus = () =>
  postDigitalTwin<EdgeInfo[]>('thirdparty/maps/info', { mapName: MAP_CODE });

/** 전체/수행 중 작업 목록 (Path: "thirdparty/tasks") */
export const fetchWorkSection = () =>
  postDigitalTwin<TaskDto[]>('thirdparty/tasks');

/** 대기 중 작업 목록 (Path: "thirdparty/tasks") */
export const fetchMissionSection = () =>
  postDigitalTwin<TaskDto[]>('thirdparty/tasks');

/** 예약된 작업 목록 (Path: "thirdparty/tasks") */
export const fetchReservationSection = () =>
  postDigitalTwin<TaskDto[]>('thirdparty/tasks');

// ── 미들웨어 추가 엔드포인트 ──────────────────────────────────────

/** 충전기 목록 조회 (Path: "thirdparty/chargers") */
export const fetchChargers = () =>
  postDigitalTwin<unknown[]>('thirdparty/chargers');

/** 알람 정보 조회 (Path: "thirdparty/alarms") */
export const fetchAlarms = () =>
  postDigitalTwin<unknown[]>('thirdparty/alarms');

/** 맵 이름 목록 조회 (Path: "thirdparty/maps") */
export const fetchMapNames = () =>
  postDigitalTwin<string[]>('thirdparty/maps');

/** 용기 타입 목록 조회 (Path: "thirdparty/containers") */
export const fetchContainerTypes = () =>
  postDigitalTwin<unknown[]>('thirdparty/containers');

/** 헬스 체크 (Path: "thirdparty/health") */
export const fetchHealth = () =>
  postDigitalTwin<string>('thirdparty/health');