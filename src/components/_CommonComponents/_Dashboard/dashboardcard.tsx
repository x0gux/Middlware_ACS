import styled from "@emotion/styled";
import ActiveRobotCard from "./cards/ActiveRobotCard";
import DeviceStatCard from "./cards/DeviceStatCard";
import TaskSummaryCard from "./cards/TaskSummaryCard";
import BatteryInfoCard from "./cards/BatteryInfoCard";
import RecentAlertsCard from "./cards/RecentAlertsCard";
import RealtimeChartCard from "./cards/RealtimeChartCard";

export type CardType =
    | "_ActiveRobot"
    | "_Device_all"
    | "_Device_error"
    | "_Chart"
    | "_Task_summary"
    | "_Battery_info"
    | "_Recent_alerts";

export interface AlertItem {
    id: string;
    time: string;
    robotId: string;
    message: string;
    level: "error" | "warning";
}

interface DashboardCardProps {
    type: CardType;
}

const DashboardCard = ({ type }: DashboardCardProps) => {
    return (
        <CardContainer type={type}>
            {type === "_ActiveRobot" && <ActiveRobotCard />}
            {type === "_Device_all" && <DeviceStatCard type="_Device_all" />}
            {type === "_Device_error" && <DeviceStatCard type="_Device_error" />}
            {type === "_Task_summary" && <TaskSummaryCard />}
            {type === "_Battery_info" && <BatteryInfoCard />}
            {type === "_Recent_alerts" && <RecentAlertsCard />}
            {type === "_Chart" && <RealtimeChartCard />}
        </CardContainer>
    );
};

export default DashboardCard;



const CardContainer = styled.div<{ type: CardType }>`
  width: 100%;
  min-height: 180px;
  height: 100%;

  border-radius: 16px;
  border: 1px solid #e9d5ff;
  background-color: #ffffff;
  box-shadow: 0 4px 20px rgba(168, 85, 247, 0.05);
  padding: 16px;
  box-sizing: border-box;

  grid-column: ${(props) => {
        if (props.type === "_ActiveRobot" ||
            props.type === "_Chart") {
            return "span 2";
        } else if (props.type === "_Recent_alerts") {
            return "span 4";
        }
        return "span 1";
    }};

  grid-row: ${(props) => {
        if (props.type === "_Chart" ||
            props.type === "_Task_summary" ||
            props.type === "_Battery_info"
        ) {
            return "span 2";
        }
        return "span 1";
    }};

  @media (max-width: 900px) {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
  }
`;