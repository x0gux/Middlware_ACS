import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import Dygraph from "dygraphs";
import "dygraphs/dist/dygraph.min.css";

export type CardType =
    | "_ActiveRobot"
    | "_Device_all"
    | "_Device_error"
    | "_Chart"
    | "_Task_summary"
    | "_Battery_info"
    | "_Recent_alerts"
    | "_Mini_map";

interface AlertItem {
    id: string;
    time: string;
    robotId: string;
    message: string;
    level: "error" | "warning";
}

interface DashboardCardProps {
    type: CardType;
    chartData?: Array<[Date, number, number]>;
    alerts?: AlertItem[];
}

const DashboardCard = ({ type, chartData, alerts }: DashboardCardProps) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (type !== "_Chart" || !chartRef.current) return;

        const defaultData: Array<[Date, number, number]> = [
            [new Date("2026-08-31 10:00"), 10, 20],
            [new Date("2026-08-31 11:00"), 25, 18],
            [new Date("2026-08-31 12:00"), 15, 30],
            [new Date("2026-08-31 13:00"), 35, 25],
        ];

        const dygraph = new Dygraph(chartRef.current, chartData ?? defaultData, {
            labels: ["시간", "로봇 가동률", "기기 부하율"],
            colors: ["#7e22ce", "#e11d48"],
            strokeWidth: 2,
            legend: "onmouseover",
            animatedZooms: true,
        });

        const handleResize = () => dygraph.resize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            dygraph.destroy();
        };
    }, [type, chartData]);

    const defaultAlerts: AlertItem[] = alerts ?? [
        { id: "1", time: "14:02:11", robotId: "AGV-02", message: "장애물 지속 감지 정지", level: "error" },
        { id: "2", time: "13:58:45", robotId: "AMR-05", message: "배터리 부족 (15%)", level: "warning" },
        { id: "3", time: "13:40:02", robotId: "AGV-01", message: "경로 이탈 경고", level: "warning" },
    ];

    if (type === "_ActiveRobot") {
        return (
            <CardContainer type={type}>
                <InfoBox $status="online">
                    <p>온라인</p>
                    <p>34</p>
                </InfoBox>
                <InfoBox $status="offline">
                    <p>오프라인</p>
                    <p>23</p>
                </InfoBox>
            </CardContainer>
        );
    }

    if (type === "_Device_all") {
        return (
            <CardContainer type={type}>
                <InfoBox $status="offline">
                    <p>전체기기</p>
                    <p>57</p>
                </InfoBox>
            </CardContainer>
        );
    }

    if (type === "_Device_error") {
        return (
            <CardContainer type={type}>
                <InfoBox $status="error">
                    <p>고장난기기</p>
                    <p>12</p>
                </InfoBox>
            </CardContainer>
        );
    }

    if (type === "_Task_summary") {
        return (
            <CardContainer type={type}>
                <CardHeader>
                    <p>작업 처리 현황</p>
                </CardHeader>
                <StatusGrid>
                    <MiniStatBox>
                        <span>대기 중</span>
                        <strong style={{ color: "#7e22ce" }}>8</strong>
                    </MiniStatBox>
                    <MiniStatBox>
                        <span>진행 중</span>
                        <strong style={{ color: "#2563eb" }}>14</strong>
                    </MiniStatBox>
                    <MiniStatBox>
                        <span>완료</span>
                        <strong style={{ color: "#16a34a" }}>142</strong>
                    </MiniStatBox>
                    <MiniStatBox>
                        <span>지연/실패</span>
                        <strong style={{ color: "#dc2626" }}>2</strong>
                    </MiniStatBox>
                </StatusGrid>
            </CardContainer>
        );
    }

    if (type === "_Battery_info") {
        return (
            <CardContainer type={type}>
                <CardHeader>
                    <p>배터리 및 충전소</p>
                </CardHeader>
                <BatteryContent>
                    <BatteryItem>
                        <span>충전 진행 중</span>
                        <ProgressWrapper>
                            <ProgressBar width="66%" color="#a855f7" />
                        </ProgressWrapper>
                        <strong>4 / 6 대</strong>
                    </BatteryItem>
                    <BatteryItem>
                        <span>배터리 경고 (20% 이하)</span>
                        <ProgressWrapper>
                            <ProgressBar width="20%" color="#f43f5e" />
                        </ProgressWrapper>
                        <strong style={{ color: "#f43f5e" }}>2 대</strong>
                    </BatteryItem>
                </BatteryContent>
            </CardContainer>
        );
    }

    if (type === "_Recent_alerts") {
        return (
            <CardContainer type={type}>
                <CardHeader>
                    <p>실시간 이벤트 알람</p>
                </CardHeader>
                <AlertList>
                    {defaultAlerts.map((alert) => (
                        <AlertRow key={alert.id} $level={alert.level}>
                            <span className="time">{alert.time}</span>
                            <span className="robot">{alert.robotId}</span>
                            <span className="msg">{alert.message}</span>
                        </AlertRow>
                    ))}
                </AlertList>
            </CardContainer>
        );
    }

    if (type === "_Mini_map") {
        return (
            <CardContainer type={type}>
                <CardHeader>
                    <p>실시간 관제 미니맵</p>
                </CardHeader>
                <MapCanvasPlaceholder>
                    <MapNode style={{ top: "20%", left: "20%" }}>N1</MapNode>
                    <MapNode style={{ top: "20%", left: "70%" }}>N2</MapNode>
                    <MapNode style={{ top: "70%", left: "30%" }}>N3</MapNode>
                    <MapNode style={{ top: "70%", left: "80%" }}>N4</MapNode>

                    <RobotIcon style={{ top: "18%", left: "40%" }} $status="active">
                        🤖 AGV-01
                    </RobotIcon>
                    <RobotIcon style={{ top: "68%", left: "50%" }} $status="warning">
                        ⚠️ AMR-05
                    </RobotIcon>
                </MapCanvasPlaceholder>
            </CardContainer>
        );
    }

    if (type === "_Chart") {
        return (
            <CardContainer type={type}>
                <CardHeader>
                    <p>실시간 상태 추이</p>
                </CardHeader>
                <ChartWrapper ref={chartRef} />
            </CardContainer>
        );
    }

    return null;
};

export default DashboardCard;

/* ================= Styled Components ================= */

type StatusType = "online" | "offline" | "error";

const CardContainer = styled.div<{ type: CardType }>`
  width: 100%;
  min-height: 180px;
  height: 100%;
  
  border-radius: 16px;
  border: 1px solid #e9d5ff; 
  background-color: #ffffff;
  box-shadow: 0 4px 20px rgba(168, 85, 247, 0.05);

  /* Grid 너비 분기 (2칸 / 1칸) */
  grid-column: ${(props) => {
        if (
            props.type === "_Recent_alerts" ||
            props.type === "_ActiveRobot" ||
            props.type === "_Chart"
        ) {
            return "span 2";
        }
        else if (props.type === "_Mini_map") {
            return "span 4";
        }
        return "span 1";
    }};

  /* Grid 높이 분기 (2칸 / 1칸) */
  grid-row: ${(props) => {
        if (props.type === "_Chart" || props.type === "_Mini_map") {
            return "span 2";
        }
        return "span 1";
    }};
  
  display: flex;
  /* 💡 단순 숫자 카드류만 row 정렬, 헤더가 필요한 복합 카드는 column 정렬 */
  flex-direction: ${(props) =>
        props.type === "_ActiveRobot" ||
            props.type === "_Device_all" ||
            props.type === "_Device_error"
            ? "row"
            : "column"};
  justify-content: space-between;
  align-items: stretch;
  gap: 12px;
  padding: 16px;
  box-sizing: border-box;

  @media (max-width: 900px) {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
  }
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

const InfoBox = styled.div<{ $status: StatusType }>`
  width: 100%;
  flex: 1;
  border-radius: 12px;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;

  background-color: ${(props) => {
        if (props.$status === "online") return "#f3e8ff";
        if (props.$status === "error") return "#fff1f2";
        return "#f8fafc";
    }};

  border: 1px solid ${(props) => {
        if (props.$status === "online") return "#e9d5ff";
        if (props.$status === "error") return "#fecdd3";
        return "#f1f5f9";
    }};

  p:nth-of-type(1) {
    font-size: 13px;
    font-weight: 600;
    color: ${(props) => {
        if (props.$status === "online") return "#7e22ce";
        if (props.$status === "error") return "#e11d48";
        return "#64748b";
    }};
    margin: 0;
  }

  p:nth-of-type(2) {
    font-size: 28px;
    font-weight: 800;
    color: ${(props) => {
        if (props.$status === "online") return "#581c87";
        if (props.$status === "error") return "#9f1239";
        return "#334155";
    }};
    margin: 0;
  }
`;

const StatusGrid = styled.div`
  width: 100%;
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const MiniStatBox = styled.div`
  background: #fcfaff;
  border: 1px solid #f3e8ff;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    font-size: 12px;
    color: #64748b;
  }
  strong {
    font-size: 18px;
    font-weight: 700;
  }
`;

const BatteryContent = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
`;

const BatteryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #475569;

  span {
    width: 130px;
  }
  strong {
    width: 60px;
    text-align: right;
  }
`;

const ProgressWrapper = styled.div`
  flex: 1;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ width: string; color: string }>`
  width: ${(props) => props.width};
  height: 100%;
  background-color: ${(props) => props.color};
  border-radius: 4px;
`;

const AlertList = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
`;

const AlertRow = styled.div<{ $level: "error" | "warning" }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  background-color: ${(props) => (props.$level === "error" ? "#fff1f2" : "#fffbebe6")};
  border-left: 3px solid ${(props) => (props.$level === "error" ? "#e11d48" : "#f59e0b")};

  .time {
    color: #94a3b8;
  }
  .robot {
    font-weight: 700;
    color: #334155;
  }
  .msg {
    flex: 1;
    color: #475569;
  }
`;

const MapCanvasPlaceholder = styled.div`
  width: 100%;
  flex: 1;
  min-height: 200px;
  background-color: #faf5ff;
  border: 1px dashed #d8b4fe;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
`;

const MapNode = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  background: #e9d5ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #6b21a8;
  font-weight: bold;
`;

const RobotIcon = styled.div<{ $status: "active" | "warning" }>`
  position: absolute;
  padding: 4px 8px;
  background: ${(props) => (props.$status === "active" ? "#7e22ce" : "#e11d48")};
  color: #ffffff;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const ChartWrapper = styled.div`
  width: 100%;
  flex: 1;
  min-height: 200px;
`;