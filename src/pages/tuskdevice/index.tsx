import styled from "@emotion/styled";
import { useGetRobotStatus } from "../../hooks/useThridParty";
import DeviceCard from "../../components/_DeviceComponents/devicecard";

const DeviceManagement = () => {
  const { data: robotData, isLoading, isError, error, refetch } = useGetRobotStatus();

  return (
    <PageWrapper>

      <HeaderSection>
        <TitleGroup>
          <h2>디바이스 관리</h2>
          <p>미들웨어에 연결된 AMR/AGV 로봇의 실시간 상태를 모니터링합니다.</p>
        </TitleGroup>
        {robotData && (
          <StatusBadge>
            총 <strong>{robotData.length}</strong>대 연결됨
          </StatusBadge>
        )}
      </HeaderSection>

      {isLoading && (
        <LoadingState>
          <Spinner />
          <p>로봇 상태 정보를 불러오는 중입니다...</p>
        </LoadingState>
      )}

      {isError && (
        <ErrorState>
          <p>⚠️ {error?.message || "디지털트윈 서버 통신에 실패했습니다."}</p>
          <RetryButton onClick={() => refetch()}>다시 시도</RetryButton>
        </ErrorState>
      )}

      {!isLoading && !isError && robotData && robotData.length > 0 && (
        <GridContainer>
          {robotData.map((robot, index) => (
            <DeviceCard key={robot.robotId ?? index} data={robot} />
          ))}
        </GridContainer>
      )}

      {!isLoading && !isError && (!robotData || robotData.length === 0) && (
        <EmptyState>
          <p>연결된 디바이스가 없습니다.</p>
        </EmptyState>
      )}
    </PageWrapper>
  );
};

export default DeviceManagement;



const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 24px;
  background-color: #fcfaff;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 2px solid #f3e8ff;
  padding-bottom: 16px;
`;

const TitleGroup = styled.div`
  h2 {
    font-size: 22px;
    font-weight: 800;
    color: #581c87;
    margin: 0 0 4px 0;
  }
  p {
    font-size: 13px;
    color: #7e22ce;
    opacity: 0.8;
    margin: 0;
  }
`;

const StatusBadge = styled.div`
  background-color: #f3e8ff;
  color: #6b21a8;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #e9d5ff;

  strong {
    color: #581c87;
    font-weight: 800;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  width: 100%;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 12px;
  color: #7e22ce;
  font-size: 14px;
  font-weight: 600;
`;

const Spinner = styled.div`
  width: 36px;
  height: 36px;
  border: 3px solid #f3e8ff;
  border-top-color: #7e22ce;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #fff1f2;
  border: 1px solid #ffe4e6;
  border-radius: 12px;
  color: #e11d48;
  gap: 12px;
  font-size: 14px;
`;

const RetryButton = styled.button`
  background-color: #7e22ce;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #6b21a8;
  }
`;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px;
  background-color: #ffffff;
  border: 1px dashed #d8b4fe;
  border-radius: 12px;
  color: #a855f7;
  font-size: 14px;
`;