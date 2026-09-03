import { MAP_CODE, postThirdparty } from "./base";
import type { ConnectionInfo } from "../types/connection";
import type { LineInfo, MapDetailsInfo, MapPointInfo, MapLineInfo } from "../types/node";
import type { RobotStatus, ChargerStatus } from "../types/device";
import type { StorageInfo } from "../types/map";
import type { TaskDto } from "../types/work";

// ── C# 미들웨어 엔드포인트 연동 (ThirdParty Handlers) ──────────────

/** 대외 연결 및 스토리지 상태 (Path: "thirdparty/storage") */
export const fetchConnectionInfo = () =>
  postThirdparty<ConnectionInfo[]>('thirdparty/storage');

/** 라인 PLC / 스토리지 상태 (Path: "thirdparty/storage") */
export const fetchLineInfo = () =>
  postThirdparty<LineInfo[]>('thirdparty/storage');

/** 로봇 목록 조회 (Path: "thirdparty/robots") */
export const fetchRobotStatus = () =>
  postThirdparty<RobotStatus[]>('thirdparty/robots');


// 함수 외부에 최신 성공 데이터를 보관할 변수 선언
let lastKnownRobots: RobotStatus[] = [];
let lastKnownChargers: ChargerStatus[] = [];

export const fetchDeviceStatus = async () => {
  const [robots, chargers] = await Promise.all([
    // 1. 로봇 요청
    postThirdparty<RobotStatus[]>('thirdparty/robots')
      .then((data) => {
        if (Array.isArray(data)) {
          lastKnownRobots = data; // 성공 시 최신값 갱신
        }
        return lastKnownRobots;
      })
      .catch((err) => {
        console.warn('로봇 조회 실패 - 이전 성공 데이터 유지:', err);
        return lastKnownRobots; // 실패 시 이전 성공 데이터 반환
      }),

    // 2. 충전기 요청
    postThirdparty<ChargerStatus[]>('thirdparty/chargers')
      .then((data) => {
        if (Array.isArray(data)) {
          lastKnownChargers = data; // 성공 시 최신값 갱신
        }
        return lastKnownChargers;
      })
      .catch((err) => {
        console.warn('충전기 조회 실패 - 이전 성공 데이터 유지:', err);
        return lastKnownChargers; // 실패 시 이전 성공 데이터 반환
      }),
  ]);

  return {
    robots,
    chargers,
  };
};
/** 맵 상세 정보(노드+엣지) (Path: "thirdparty/maps/info") — 신 미들웨어 MapDetailsDto { points, lines } */
export const fetchMapDetails = () =>
  postThirdparty<MapDetailsInfo>('thirdparty/maps/info', { mapName: MAP_CODE });

/** 노드 목록 (맵 상세의 points) */
export const fetchNodeStatus = async (): Promise<MapPointInfo[]> =>
  (await fetchMapDetails()).points ?? [];

export const fetchStorageStatus = async () =>
  postThirdparty<StorageInfo[]>('thirdparty/storage');

/** 엣지 목록 (맵 상세의 lines) */
export const fetchEdgeStatus = async (): Promise<MapLineInfo[]> =>
  (await fetchMapDetails()).lines ?? [];

/** 전체/수행 중 작업 목록 (Path: "thirdparty/tasks") */
export const fetchWorkSection = () =>
  postThirdparty<TaskDto[]>('thirdparty/tasks');

/** 대기 중 작업 목록 (Path: "thirdparty/tasks") */
export const fetchMissionSection = () =>
  postThirdparty<TaskDto[]>('thirdparty/tasks');

/** 예약된 작업 목록 (Path: "thirdparty/tasks") */
export const fetchReservationSection = () =>
  postThirdparty<TaskDto[]>('thirdparty/tasks');

// ── 미들웨어 추가 엔드포인트 ──────────────────────────────────────

/** 충전기 목록 조회 (Path: "thirdparty/chargers") */
export const fetchChargers = () =>
  postThirdparty<unknown[]>('thirdparty/chargers');

/** 알람 정보 조회 (Path: "thirdparty/alarms") */
export const fetchAlarms = () =>
  postThirdparty<unknown[]>('thirdparty/alarms');

/** 맵 이름 목록 조회 (Path: "thirdparty/maps") */
export const fetchMapNames = () =>
  postThirdparty<string[]>('thirdparty/maps');

/** 용기 타입 목록 조회 (Path: "thirdparty/containers") */
export const fetchContainerTypes = () =>
  postThirdparty<unknown[]>('thirdparty/containers');

/** 헬스 체크 (Path: "thirdparty/health") */
export const fetchHealth = () =>
  postThirdparty<string>('thirdparty/health');