import type { ChargerStatus } from "../../types/device";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";


interface DeviceCardProps {
  data: ChargerStatus;
}

const ChargerCard = ({ data }: DeviceCardProps) => {
  const navigate = useNavigate();

  const chargerId = data.id;
  const robotSoc = data.robotSoc;

  return (
    <DeviceCardLayout onClick={() => navigate(`${chargerId}`, { state: data })}>
      <Header>
        <MainText>충전기 ID: {chargerId}</MainText>
      </Header>

      <ContentGroup>
        <SubText>기기 타입 : {data.deviceType || "미지정"}</SubText>
        <SubText>
          충전 상태 : {data.stat || (data.available ? "사용 가능" : "충전 중")}
        </SubText>
        <SubText>
          연결된 로봇 : {data.robotId ? <strong>{data.robotId}</strong> : "없음"}
        </SubText>
        <SubText>
          로봇 배터리 잔량 :{" "}
          <strong>
            {robotSoc !== null && robotSoc !== undefined ? `${robotSoc}%` : "-"}
          </strong>
        </SubText>
        <SubText>맵 ID : {data.mapId || "미지정"}</SubText>
        <SubText>IP 주소 : {data.ip || "미지정"}</SubText>
      </ContentGroup>
    </DeviceCardLayout>
  );
};

export default ChargerCard;

/* ── UI Styles (기존과 동일) ───────────────────────────────── */

const DeviceCardLayout = styled.div`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e9d5ff;
  border-radius: 16px;
  padding: 20px;
  background-color: #ffffff;
  color: #000000;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out;
  &:hover {
    background-color: #fafafaff;
    border-color: #d2a9ffff;
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
  color: #581c87;
  font-family: 'PretendardVariable', sans-serif;
  margin: 0;
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