import type { RobotStatus, ChargerStatus } from "../types/device";

export type DeviceData = RobotStatus | ChargerStatus;

export const getStatusInfo = (data: DeviceData) => {
    // 1. 충전기(ChargerStatus) 데이터인 경우
    if ("stat" in data || "available" in data) {
        const charger = data as ChargerStatus;
        if (charger.offline) {
            return { text: "오프라인", color: "#dc2626", bg: "#fee2e2" };
        }
        if (charger.stat === "Charging" || charger.available === false) {
            return { text: "충전중", color: "#7e22ce", bg: "#f3e8ff" };
        }
        return { text: "대기중", color: "#2563eb", bg: "#dbeafe" };
    }

    // 2. 로봇(RobotStatus) 데이터인 경우
    const robot = data as RobotStatus;
    if (robot.offline) {
        return { text: "오프라인", color: "#dc2626", bg: "#fee2e2" };
    }
    if (robot.paused) {
        return { text: "일시정지", color: "#d97706", bg: "#fef3c7" };
    }
    if (robot.driving) {
        return { text: "주행중", color: "#7e22ce", bg: "#f3e8ff" };
    }
    return { text: "대기중", color: "#2563eb", bg: "#dbeafe" };
};