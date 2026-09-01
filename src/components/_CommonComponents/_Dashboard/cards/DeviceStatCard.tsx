import styled from "@emotion/styled";
import { useGetDeviceStatus } from "../../../../hooks/useThridParty";

interface Props {
  type: "_Device_all" | "_Device_error";
}

const DeviceStatCard = ({ type }: Props) => {
  const isError = type === "_Device_error";
  const { data } = useGetDeviceStatus();

  const robots = data?.robots ?? [];
  const chargers = data?.chargers ?? [];

  const total = robots.length + chargers.length;
  const broken = robots.filter((r) => r.paused).length;

  return (
    <Wrapper>
      <InfoBox $status={isError ? "error" : "offline"}>
        <p>{isError ? "멈춘 기기" : "전체기기"}</p>
        <p>{isError ? broken : total}</p>
        <p>{isError ? "" : "AMR : " + robots.length + " 충전기 : " + chargers.length}</p>
      </InfoBox>
    </Wrapper>
  );
};

export default DeviceStatCard;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const InfoBox = styled.div<{ $status: "offline" | "error" }>`
  width: 100%;
  flex: 1;
  border-radius: 12px;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;

  background-color: ${(props) => (props.$status === "error" ? "#fff1f2" : "#f8fafc")};
  border: 1px solid ${(props) => (props.$status === "error" ? "#fecdd3" : "#f1f5f9")};

  p:nth-of-type(1) {
    font-size: 13px;
    font-weight: 600;
    color: ${(props) => (props.$status === "error" ? "#e11d48" : "#64748b")};
    margin: 0;
  }

  p:nth-of-type(2) {
    font-size: 28px;
    font-weight: 800;
    color: ${(props) => (props.$status === "error" ? "#9f1239" : "#334155")};
    margin: 0;
  }

  p:nth-of-type(3) {
    font-size: 13px;
    font-weight: 600;
    color: ${(props) => (props.$status === "error" ? "#e11d48" : "#64748b")};
    margin: 0;
  }
`;