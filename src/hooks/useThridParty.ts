import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
    fetchConnectionInfo,
    fetchLineInfo,
    fetchRobotStatus,
    fetchNodeStatus,
    fetchEdgeStatus,
    fetchWorkSection,
    fetchMissionSection,
    fetchReservationSection,
    fetchDeviceStatus,
    fetchAlarms
} from "../api/Info";

import { moveRobot, rackMoveRobot, chargeRobot, cancelMission } from "../api/manual";

// ── 1. Query Key Centralization ────────────────────────────────
export const digitalTwinKeys = {
    all: ["digitalTwin"] as const,
    connection: () => [...digitalTwinKeys.all, "connection"] as const,
    line: () => [...digitalTwinKeys.all, "line"] as const,
    robots: () => [...digitalTwinKeys.all, "robots"] as const,
    nodes: () => [...digitalTwinKeys.all, "nodes"] as const,
    edges: () => [...digitalTwinKeys.all, "edges"] as const,
    works: () => [...digitalTwinKeys.all, "works"] as const,
    missions: () => [...digitalTwinKeys.all, "missions"] as const,
    reservations: () => [...digitalTwinKeys.all, "reservations"] as const,
    devices: () => [...digitalTwinKeys.all, "devices"] as const,
    alarms: () => [...digitalTwinKeys.all, "alarms"] as const,
};

// ── 2. Query Hooks (조회 계열) ──────────────────────────────────
// 폴링 조회들은 placeholderData: keepPreviousData 로 실패 시 이전 데이터를 유지해
// 일시적 오류에도 화면이 비워지지 않도록 한다. (성공 시 다음 폴링에서 갱신)

/** 대외 연결 상태 */
export const useGetConnectionInfo = () => {
    return useQuery({
        queryKey: digitalTwinKeys.connection(),
        queryFn: fetchConnectionInfo,
        refetchInterval: 5000,
        placeholderData: keepPreviousData,
    });
};

/** 라인 PLC / 스토리지 상태 */
export const useGetLineInfo = () => {
    return useQuery({
        queryKey: digitalTwinKeys.line(),
        queryFn: fetchLineInfo,
        refetchInterval: 3000,
        placeholderData: keepPreviousData,
    });
};

/** 로봇 목록 및 상태 (3초 간격 실시간 폴링) */
export const useGetRobotStatus = () => {
    return useQuery({
        queryKey: digitalTwinKeys.robots(),
        queryFn: fetchRobotStatus,
        refetchInterval: 3000,
        placeholderData: keepPreviousData,
    });
};

export const useGetDeviceStatus = () => {
    return useQuery({
        queryKey: digitalTwinKeys.devices(),
        queryFn: fetchDeviceStatus,
        refetchInterval: 3000,
        placeholderData: keepPreviousData,
    });
};

/** 노드 목록 */
export const useGetNodeStatus = () => {
    return useQuery({
        queryKey: digitalTwinKeys.nodes(),
        queryFn: fetchNodeStatus,
        staleTime: 1000 * 60 * 5, // 지도 노드는 자주 바뀌지 않으므로 캐싱 활성화
    });
};

/** 엣지 목록 */
export const useGetEdgeStatus = () => {
    return useQuery({
        queryKey: digitalTwinKeys.edges(),
        queryFn: fetchEdgeStatus,
        staleTime: 1000 * 60 * 5,
    });
};

/** 수행 중 작업 리스트 */
export const useGetWorkSection = () => {
    return useQuery({
        queryKey: digitalTwinKeys.works(),
        queryFn: fetchWorkSection,
        refetchInterval: 2000,
        placeholderData: keepPreviousData,
    });
};

/** 대기 중 미션 리스트 */
export const useGetMissionSection = () => {
    return useQuery({
        queryKey: digitalTwinKeys.missions(),
        queryFn: fetchMissionSection,
        refetchInterval: 2000,
        placeholderData: keepPreviousData,
    });
};

/** 예약된 작업 리스트 */
export const useGetReservationSection = () => {
    return useQuery({
        queryKey: digitalTwinKeys.reservations(),
        queryFn: fetchReservationSection,
        refetchInterval: 2000,
        placeholderData: keepPreviousData,
    });
};

/** 알람 정보 (Path: thirdparty/alarms, 3초 간격 폴링) */
export const useGetAlarms = () => {
    return useQuery({
        queryKey: digitalTwinKeys.alarms(),
        queryFn: fetchAlarms,
        refetchInterval: 3000,
        placeholderData: keepPreviousData,
    });
};

// ── 3. Mutation Hooks (명령 계열) ───────────────────────────────

/** 수동 이동 */
export const useMoveRobot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ amrId, targetNodeCode }: { amrId: string; targetNodeCode: string }) =>
            moveRobot(amrId, targetNodeCode),
        onSuccess: (res) => {
            if (res.success) {
                // 성공 시 로봇 상태 및 작업 정보 갱신
                queryClient.invalidateQueries({ queryKey: digitalTwinKeys.robots() });
                queryClient.invalidateQueries({ queryKey: digitalTwinKeys.works() });
            }
        },
    });
};

/** 수동 랙 이동 */
export const useRackMoveRobot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            amrId,
            startNodeCode,
            targetNodeCode,
        }: {
            amrId: string;
            startNodeCode: string;
            targetNodeCode: string;
        }) => rackMoveRobot(amrId, startNodeCode, targetNodeCode),
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: digitalTwinKeys.robots() });
                queryClient.invalidateQueries({ queryKey: digitalTwinKeys.works() });
            }
        },
    });
};

/** 충전 이동 */
export const useChargeRobot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ amrId, targetNodeCode }: { amrId: string; targetNodeCode: string }) =>
            chargeRobot(amrId, targetNodeCode),
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: digitalTwinKeys.robots() });
            }
        },
    });
};

/** 미션 취소 */
export const useCancelMission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (cancelMissionCode: string) => cancelMission(cancelMissionCode),
        onSuccess: (res) => {
            if (res.success) {
                // 미션 취소 시 관련 작업/미션 목록 무효화
                queryClient.invalidateQueries({ queryKey: digitalTwinKeys.works() });
                queryClient.invalidateQueries({ queryKey: digitalTwinKeys.missions() });
                queryClient.invalidateQueries({ queryKey: digitalTwinKeys.reservations() });
            }
        },
    });
};