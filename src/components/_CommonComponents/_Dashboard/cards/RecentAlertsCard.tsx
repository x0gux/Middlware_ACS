import styled from "@emotion/styled";
import type { AlertItem } from "../dashboardcard";

interface Props {
    alerts?: AlertItem[];
}

const RecentAlertsCard = ({ alerts }: Props) => {
    const defaultAlerts: AlertItem[] = alerts ?? [
        { id: "1", time: "14:02:11", robotId: "AGV-02", message: "장애물 지속 감지 정지", level: "error" },
        { id: "2", time: "13:58:45", robotId: "AMR-05", message: "배터리 부족 (15%)", level: "warning" },
        { id: "3", time: "13:40:02", robotId: "AGV-01", message: "경로 이탈 경고", level: "warning" },
    ];

    return (
        <Wrapper>
            <CardHeader><p>실시간 이벤트 알람</p></CardHeader>
            <AlertList>
                {defaultAlerts.map((alert) => (
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

const Wrapper = styled.div` display: flex; flex-direction: column; justify-content: space-between; height: 100%; gap: 12px; `;
const CardHeader = styled.div` width: 100%; p { font-size: 14px; font-weight: 700; color: #581c87; margin: 0; } `;
const AlertList = styled.div` width: 100%; flex: 1; display: flex; flex-direction: column; gap: 6px; overflow-y: auto; `;
const AlertRow = styled.div<{ $level: "error" | "warning" }>`
  display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 6px; font-size: 12px;
  background-color: ${(props) => (props.$level === "error" ? "#fff1f2" : "#fffbebe6")};
  border-left: 3px solid ${(props) => (props.$level === "error" ? "#e11d48" : "#f59e0b")};
  .time { color: #94a3b8; } .robot { font-weight: 700; color: #334155; } .msg { flex: 1; color: #475569; }
`;