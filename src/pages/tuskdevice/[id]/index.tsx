import { useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { InfoCard, InfoRow } from "../../../components/_DeviceComponents/InfoCard";
import type { RobotStatus, ChargerStatus } from "../../../types/device";
import { getStatusInfo } from "../../../libs/statuscolor";

type DeviceData = RobotStatus | ChargerStatus;

// 충전기 데이터인지 판별하는 타입 가드 함수
const isChargerData = (data: DeviceData): data is ChargerStatus => {
  return "stat" in data || "available" in data || "robotSoc" in data || "ip" in data;
};

const RobotDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const deviceData = location.state as DeviceData;

  if (!deviceData) {
    return (
      <FallbackContainer>
        <h2>데이터를 불러올 수 없습니다.</h2>
        <p>목록에서 다시 기기를 선택해주세요.</p>
        <Backbutton onClick={() => navigate(-1)}>목록으로 돌아가기</Backbutton>
      </FallbackContainer>
    );
  }
  const statusInfo = getStatusInfo(deviceData);

  const isCharger = isChargerData(deviceData);

  return (
    <DashboardContainer>
      <HeaderSection>
        <TitleGroup>
          <Title>
            <h2>
              디바이스 관리 - {isCharger ? "충전기" : "로봇"} ID : {deviceData.id}
            </h2>
            <StatusBadge $color={statusInfo.color} $bg={statusInfo.bg}>
              {statusInfo.text}
            </StatusBadge>
          </Title>
          <p>
            {isCharger
              ? "미들웨어에 연결된 충전기의 상세 정보를 확인합니다."
              : "미들웨어에 연결된 AMR/AGV 로봇의 정보를 확인합니다."}
          </p>
        </TitleGroup>

        <Backbutton onClick={() => navigate(-1)}>뒤로가기</Backbutton>
      </HeaderSection>

      <GridContainer>
        {isCharger ? (
          /* ── 충전기 전용 상세 정보 ── */
          <>
            <InfoCard title="기본 및 네트워크 정보">
              <InfoRow label="충전기 ID">{deviceData.id}</InfoRow>
              <InfoRow label="기기 타입">{deviceData.deviceType || "미지정"}</InfoRow>
              <InfoRow label="현재 맵 ID">{deviceData.mapId || "-"}</InfoRow>
              <InfoRow label="IP 주소">{deviceData.ip || "미지정"}</InfoRow>
            </InfoCard>

            <InfoCard title="충전기 운영 상태">
              <InfoRow label="충전 상태">
                {deviceData.stat || (deviceData.available ? "사용 가능" : "충전 중")}
              </InfoRow>
              <InfoRow label="사용 가능 여부">
                {deviceData.available ? "가능" : "불가 / 충전 중"}
              </InfoRow>
              <InfoRow
                label="네트워크 상태"
                color={deviceData.offline ? "#dc2626" : "#7e22ce"}
              >
                {deviceData.offline ? "오프라인" : "온라인"}
              </InfoRow>
            </InfoCard>

            <InfoCard title="연결된 로봇 정보">
              <InfoRow label="연결 로봇 ID">{deviceData.robotId || "연결 없음"}</InfoRow>
              <InfoRow
                label="로봇 배터리 잔량 (SoC)"
                color={
                  deviceData.robotSoc !== null &&
                    deviceData.robotSoc !== undefined &&
                    deviceData.robotSoc < 20
                    ? "#dc2626"
                    : "#7e22ce"
                }
                fontWeight={700}
              >
                {deviceData.robotSoc !== null && deviceData.robotSoc !== undefined
                  ? `${deviceData.robotSoc}%`
                  : "-"}
              </InfoRow>
            </InfoCard>
          </>
        ) : (
          /* ── 로봇 전용 상세 정보 ── */
          <>
            <InfoCard title="기본 및 맵 정보">
              <InfoRow label="로봇 ID">{deviceData.id}</InfoRow>
              <InfoRow label="기기 타입">{deviceData.deviceType || "미지정"}</InfoRow>
              <InfoRow label="현재 맵 ID">{deviceData.mapId || "-"}</InfoRow>
            </InfoCard>

            <InfoCard title="작업 및 운행 상태">
              <InfoRow label="현재 작업 ID">
                {deviceData.taskId || "대기중 (작업 없음)"}
              </InfoRow>
              <InfoRow label="적재 상태">
                {deviceData.load ? "적재됨" : "비어있음"}
              </InfoRow>
              <InfoRow label="주행 여부">
                {deviceData.driving ? "주행중" : "정지"}
              </InfoRow>
              <InfoRow label="일시정지 여부">
                {deviceData.paused ? "일시정지됨" : "정상 운행"}
              </InfoRow>
              <InfoRow
                label="네트워크 상태"
                color={deviceData.offline ? "#dc2626" : "#7e22ce"}
              >
                {deviceData.offline ? "오프라인" : "온라인"}
              </InfoRow>
            </InfoCard>

            <InfoCard title="위치 정보">
              <InfoRow label="좌표 (X, Y)">
                {typeof deviceData.x === "number" ? deviceData.x.toFixed(2) : "0.00"},{" "}
                {typeof deviceData.y === "number" ? deviceData.y.toFixed(2) : "0.00"}
              </InfoRow>
              <InfoRow label="로봇 방향 (Theta)">
                {typeof deviceData.theta === "number"
                  ? deviceData.theta.toFixed(1)
                  : "0.0"}
                °
              </InfoRow>
            </InfoCard>

            <InfoCard title="전력 상태">
              <InfoRow
                label="배터리 잔량"
                color={(deviceData.batteryCharge ?? 0) < 20 ? "#dc2626" : "#7e22ce"}
                fontWeight={700}
              >
                {deviceData.batteryCharge ?? 0}%
              </InfoRow>
            </InfoCard>
          </>
        )}
      </GridContainer>
    </DashboardContainer>
  );
};

export default RobotDetailPage;

// ── Styled Components (기존 유지) ─────────────────────────────

const Title = styled.div`
  display: flex;
  justify-content: space-round;
  align-items: center;
  gap: 16px;
`;

const StatusBadge = styled.span<{ $color: string; $bg: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.$color};
  background-color: ${(props) => props.$bg};
  padding: 4px 8px;
  border-radius: 6px;
`;

const Backbutton = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #aa33ffff;
  background-color: #dbb9ffff;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #aa33ffff;

  width: fit-content;
  height: fit-content;

  cursor: pointer;

  &:hover {
    background-color: #efe0ffff;
    color: #aa33ffff;
  }
`;

const DashboardContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 2px solid #e9d5ff;
  padding-bottom: 16px;
`;

const TitleGroup = styled.div`
  h2 {
    font-size: 24px;
    font-weight: 800;
    color: #3b0764;
    margin: 0 0 4px 0;
  }
  p {
    font-size: 14px;
    color: #6b21a8;
    margin: 0;
    font-weight: 500;
    opacity: 0.85;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(440px, 1fr));
  gap: 20px;
`;

const FallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 16px;
  color: #6b21a8;
  h2 {
    color: #3b0764;
  }
`;