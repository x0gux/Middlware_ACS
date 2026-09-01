import styled from "@emotion/styled";
import { useGetRobotStatus } from "../../../../hooks/useThridParty";

const ActiveRobotCard = () => {
  const { data: robots } = useGetRobotStatus();
  const list = robots ?? [];

  const online = list.filter((r) => !r.offline).length;
  const offline = list.filter((r) => r.offline).length;

  return (
    <Wrapper>
      <InfoBox $status="online">
        <p>온라인</p>
        <p>{online}</p>
      </InfoBox>
      <InfoBox $status="offline">
        <p>오프라인</p>
        <p>{offline}</p>
      </InfoBox>
    </Wrapper>
  );
};

export default ActiveRobotCard;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;
  height: 100%;
`;

const InfoBox = styled.div<{ $status: "online" | "offline" | "error" }>`
  width: 100%;
  flex: 1;
  border-radius: 12px;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;

  background-color: ${(props) => (props.$status === "online" ? "#f3e8ff" : "#f8fafc")};
  border: 1px solid ${(props) => (props.$status === "online" ? "#e9d5ff" : "#f1f5f9")};

  p:nth-of-type(1) {
    font-size: 13px;
    font-weight: 600;
    color: ${(props) => (props.$status === "online" ? "#7e22ce" : "#64748b")};
    margin: 0;
  }

  p:nth-of-type(2) {
    font-size: 28px;
    font-weight: 800;
    color: ${(props) => (props.$status === "online" ? "#581c87" : "#334155")};
    margin: 0;
  }
`;