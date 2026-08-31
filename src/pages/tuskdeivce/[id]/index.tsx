import { useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { InfoCard, InfoRow } from "../../../components/_DeviceComponents/InfoCard";
import type { RobotStatus } from "../../../types/device";

const getStatusInfo = (robot: RobotStatus) => {
  if (robot.offline) return { text: "오프라인", color: "#d32f2f", bg: "#ffebee" };
  if (robot.fieldViolation) return { text: "영역 이탈", color: "#d32f2f", bg: "#ffebee" };
  if (robot.paused) return { text: "일시정지", color: "#ed6c02", bg: "#fff3e0" };
  if (robot.driving) return { text: "주행중", color: "#2e7d32", bg: "#e8f5e9" };
  return { text: "대기중", color: "#1976d2", bg: "#e3f2fd" };
};

const RobotDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const robotData = location.state as RobotStatus;

  if (!robotData) {
    return (
      <FallbackContainer>
        <h2>데이터를 불러올 수 없습니다.</h2>
        <p>목록에서 다시 로봇을 선택해주세요.</p>
        <BackButton onClick={() => navigate(-1)}>목록으로 돌아가기</BackButton>
      </FallbackContainer>
    );
  }

  const {
    robotId, deviceType, operatingMode,
    mapCode, resolvedMapCode,
    taskId, load, driving, paused, fieldViolation, offline,
    x, y, robotOrientation, batteryLevel, agvStat,
  } = robotData;

  const statusInfo = getStatusInfo(robotData);
  const modeText =
    operatingMode === 0 ? "MANUAL" : operatingMode === 1 ? "AUTOMATIC" : operatingMode === 2 ? "SERVICE" : "알수없음";

  return (
    <DashboardContainer>
      <PageHeader>
        <TitleGroup>
          <BackButton onClick={() => navigate(-1)}>←</BackButton>
          <h2>로봇 {robotId} 상세 정보</h2>
          <StatusBadge color={statusInfo.color} bg={statusInfo.bg}>
            {statusInfo.text}
          </StatusBadge>
        </TitleGroup>
      </PageHeader>

      <GridContainer>
        <InfoCard title="기본 및 맵 정보">
          <InfoRow label="기기 타입">{deviceType}</InfoRow>
          <InfoRow label="운영 모드">{modeText}</InfoRow>
          <InfoRow label="현재 맵 코드">{mapCode}</InfoRow>
          <InfoRow label="매핑된 맵 코드">{resolvedMapCode || "없음"}</InfoRow>
        </InfoCard>

        <InfoCard title="작업 및 운행 상태">
          <InfoRow label="현재 작업 ID">{taskId || "대기중 (작업 없음)"}</InfoRow>
          <InfoRow label="적재 상태">{load ? "적재됨" : "비어있음"}</InfoRow>
          <InfoRow label="주행 여부">{driving ? "주행중" : "정지"}</InfoRow>
          <InfoRow label="일시정지 여부">{paused ? "일시정지됨" : "정상 운행"}</InfoRow>
          <InfoRow label="영역 이탈 여부" color={fieldViolation ? "#d32f2f" : undefined}>
            {fieldViolation ? "이탈 발생" : "정상"}
          </InfoRow>
          <InfoRow label="네트워크 상태" color={offline ? "#d32f2f" : "#2e7d32"}>
            {offline ? "오프라인" : "온라인"}
          </InfoRow>
        </InfoCard>

        <InfoCard title="위치 정보">
          <InfoRow label="좌표 (X, Y)">
            {x.toFixed(2)}, {y.toFixed(2)}
          </InfoRow>
          <InfoRow label="로봇 방향 (각도)">{robotOrientation.toFixed(1)}°</InfoRow>
          <InfoRow label="모션 상태 코드 (agvStat)">{agvStat ?? "-"}</InfoRow>
        </InfoCard>

        <InfoCard title="전력 상태">
          <InfoRow
            label="배터리 잔량"
            color={batteryLevel < 20 ? "#d32f2f" : "#2e7d32"}
            fontWeight={700}
          >
            {batteryLevel}%
          </InfoRow>
        </InfoCard>
      </GridContainer>
    </DashboardContainer>
  );
};

export default RobotDetailPage;

// --- Styled Components ---

const DashboardContainer = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'PretendardVariable', sans-serif;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  h2 {
    margin: 0;
    font-size: 24px;
    color: #111;
  }
`;

const BackButton = styled.button`
  background: none;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
  &:hover {
    background: #f5f5f5;
  }
`;

const StatusBadge = styled.span<{ color: string; bg: string }>`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.color};
  background-color: ${(props) => props.bg};
  padding: 6px 12px;
  border-radius: 8px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
`;

const FallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 16px;
  font-family: 'PretendardVariable', sans-serif;
  color: #555;
`;