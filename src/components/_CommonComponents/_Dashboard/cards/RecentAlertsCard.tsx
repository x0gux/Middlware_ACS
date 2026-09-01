import styled from "@emotion/styled";
import type { AlertItem } from "../dashboardcard";
import { useGetAlarms } from "../../../../hooks/useThridParty";

const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null && !Array.isArray(v);

const asString = (v: unknown): string => (typeof v === "string" ? v : "");

const toAlertItem = (raw: unknown, index: number): AlertItem | null => {
    if (!isRecord(raw)) return null;

    const message =
        asString(raw.message) ||
        asString(raw.description) ||
        asString(raw.alarmMsg) ||
        asString(raw.msg);
    if (!message) return null;

    const levelText = asString(raw.level ?? raw.severity ?? raw.alarmLevel).toLowerCase();
    const level =
        levelText.includes("error") || levelText.includes("critical")
            ? "error"
            : "warning";

    return {
        id: asString(raw.id ?? raw.alarmId) || String(index),
        time: asString(raw.time ?? raw.timestamp ?? raw.createdAt),
        robotId: asString(raw.robotId ?? raw.amrId ?? raw.agvId) || "SYSTEM",
        message,
        level,
    };
};

const RecentAlertsCard = () => {
    const { data: alarms, isLoading } = useGetAlarms();

    const items = (alarms ?? [])
        .map(toAlertItem)
        .filter((a): a is AlertItem => a !== null);

    return (
        <Wrapper>
            <CardHeader><p>실시간 이벤트 알람</p></CardHeader>
            <AlertList>
                {!isLoading && items.length === 0 && <EmptyText>알람이 없습니다.</EmptyText>}
                {items.map((alert) => (
                    <AlertRow key={alert.id} $level={alert.level}>
                        <span className="time">{alert.time}</span>
                        <span className="robot">{alert.robotId}</span>
                        <span className="msg">{alert.message}</span>
                    </AlertRow>
                ))}
            </AlertList>
        </Wrapper>
    );
};

export default RecentAlertsCard;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  height: 160px;
  gap: 12px;
`;

const CardHeader = styled.div`
  width: 100%;
  p {
    font-size: 14px;
    font-weight: 700;
    color: #581c87;
    margin: 0;
  }
`;

const AlertList = styled.div`
  width: 100%;
  flex: 1;
  min-height: 90%;

  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
`;

const EmptyText = styled.p`
  color: #a855f7;
  font-size: 13px;
  text-align: center;
  margin: 12px 0;
`;

const AlertRow = styled.div<{ $level: "error" | "warning" }>`
  display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 6px; font-size: 12px;
  background-color: ${(props) => (props.$level === "error" ? "#fff1f2" : "#fffbebe6")};
  border-left: 3px solid ${(props) => (props.$level === "error" ? "#e11d48" : "#f59e0b")};
  .time { color: #94a3b8; } .robot { font-weight: 700; color: #334155; } .msg { flex: 1; color: #475569; }
  margin-bottom : 6px;
`;