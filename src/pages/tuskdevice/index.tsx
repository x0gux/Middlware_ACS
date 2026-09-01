import styled from "@emotion/styled";
import { useGetDeviceStatus } from "../../hooks/useThridParty";
import DeviceCard from "../../components/_DeviceComponents/devicecard";
import ChargerCard from "../../components/_DeviceComponents/chargercard";

const DeviceManagement = () => {
  const { data: deviceData, isLoading, isError, error, refetch } = useGetDeviceStatus();

  // 단독 null / undefined 들어올 경우를 대비해 Array.isArray 가드 적용
  const robots = Array.isArray(deviceData?.robots) ? deviceData.robots : [];
  const chargers = Array.isArray(deviceData?.chargers) ? deviceData.chargers : [];

  const hasRobots = robots.length > 0;
  const hasChargers = chargers.length > 0;
  const isEmpty = !hasRobots && !hasChargers;

  // 전체 데이터가 아예 없을 때만 isError 화면 노출 (부분 수신 시 수신 데이터 우선 노출)
  const shouldShowError = isError && isEmpty;

  return (
    <PageWrapper>
      <HeaderSection>
        <TitleGroup>
          <h2>디바이스 관리</h2>
          <p>미들웨어에 연결된 로봇 및 충전기 기기 정보를 모니터링합니다.</p>
        </TitleGroup>
      </HeaderSection>

      {isLoading && (
        <LoadingState>
          <Spinner />
          <p>기기 상태 정보를 불러오는 중입니다...</p>
        </LoadingState>
      )}

      {shouldShowError && (
        <ErrorState>
          <p>{error?.message || "ThirdParty 서버 통신에 실패했습니다."}</p>
          <RetryButton onClick={() => refetch()}>다시 시도</RetryButton>
        </ErrorState>
      )}

      {!isLoading && !shouldShowError && isEmpty && (
        <EmptyState>
          <p>연결된 기기가 없습니다.</p>
        </EmptyState>
      )}

      {!isLoading && !shouldShowError && !isEmpty && (
        <ContentContainer>
          {/* 로봇 섹션 */}
          <Section>
            <SectionTitle>
              로봇 목록 <span>({robots.length}대)</span>
            </SectionTitle>
            {hasRobots ? (
              <GridContainer>
                {robots.map((robot, index) => (
                  <DeviceCard key={robot.id ?? `robot-${index}`} data={robot} />
                ))}
              </GridContainer>
            ) : (
              <SubEmptyState>연결된 로봇이 없습니다.</SubEmptyState>
            )}
          </Section>

          {/* 충전기 섹션 */}
          <Section>
            <SectionTitle>
              충전기 목록 <span>({chargers.length}대)</span>
            </SectionTitle>
            {hasChargers ? (
              <GridContainer>
                {chargers.map((charger, index) => (
                  <ChargerCard key={charger.id ?? `charger-${index}`} data={charger} />
                ))}
              </GridContainer>
            ) : (
              <SubEmptyState>연결된 충전기가 없습니다.</SubEmptyState>
            )}
          </Section>
        </ContentContainer>
      )}
    </PageWrapper>
  );
};

export default DeviceManagement;

// ── Styled Components ──────────────────────────────────────────

const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  overflow-y: auto; /* hidden -> auto 변경: 카드 누적으로 인한 하단 자름 방지 */
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

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #3b0764;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-size: 14px;
    font-weight: 600;
    color: #7e22ce;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
  width: 100%;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 16px;
  color: #7e22ce;
  font-size: 14px;
  font-weight: 600;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3e8ff;
  border-top-color: #7e22ce;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 16px;
  color: #dc2626;
  gap: 16px;
  font-size: 14px;
`;

const RetryButton = styled.button`
  background-color: #7e22ce;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 13px;
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
  border-radius: 16px;
  color: #9333ea;
  font-size: 14px;
  font-weight: 600;
`;

const SubEmptyState = styled.div`
  padding: 24px;
  background-color: #ffffff;
  border: 1px dashed #e9d5ff;
  border-radius: 12px;
  color: #a855f7;
  font-size: 13px;
  text-align: center;
`;