import type { RobotStatus } from "../../types/device";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

interface DeviceCardProps {
  data: RobotStatus;
}

/** 로봇 상태 배지 (불리언 조합으로 도출) */
const getStatusInfo = (r: RobotStatus) => {
  if (r.offline) return { text: "오프라인", color: "#d32f2f", bg: "#ffebee" };
  if (r.fieldViolation) return { text: "영역 이탈", color: "#d32f2f", bg: "#ffebee" };
  if (r.paused) return { text: "일시정지", color: "#ed6c02", bg: "#fff3e0" };
  if (r.driving) return { text: "주행중", color: "#2e7d32", bg: "#e8f5e9" };
  return { text: "대기중", color: "#1976d2", bg: "#e3f2fd" };
};

const DeviceCard = ({ data }: DeviceCardProps) => {
  const navigate = useNavigate();
  const statusInfo = getStatusInfo(data);

  return (
    <DeviceCardLayout onClick={() => navigate(`${data.robotId}`, { state: data })}>
      <Header>
        <MainText>로봇 ID: {data.robotId}</MainText>
        <StatusBadge color={statusInfo.color} bg={statusInfo.bg}>
          {statusInfo.text}
        </StatusBadge>
      </Header>

      <ContentGroup>
        <SubText>기기 타입 : {data.deviceType || "미지정"}</SubText>
        <SubText>
          배터리 : <strong>{data.batteryLevel}%</strong>
        </SubText>
        <SubText>적재 상태 : {data.load ? "적재됨" : "비어있음"}</SubText>
        <SubText>
          현재 위치 : ({data.x.toFixed(2)}, {data.y.toFixed(2)})
        </SubText>
        <SubText>현재 작업 : {data.taskId || "대기중"}</SubText>
      </ContentGroup>
    </DeviceCardLayout>
  );
};

export default DeviceCard;

const DeviceCardLayout = styled.div`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 20px;
  background-color: #ffffff;
  color: #000000;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out;
  &:hover {
    transform: translateY(-4px);
    border-color: #cccccc;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const MainText = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111111;
  font-family: 'PretendardVariable', sans-serif;
  margin: 0;
`;

const StatusBadge = styled.span<{ color: string; bg: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.color};
  background-color: ${(props) => props.bg};
  padding: 4px 8px;
  border-radius: 6px;
`;

const ContentGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SubText = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #444444;
  font-family: 'PretendardVariable', sans-serif;
  margin: 0;
  strong {
    color: #000000;
  }
`;