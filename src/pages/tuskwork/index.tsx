import styled from "@emotion/styled";
import {
  useGetWorkSection,
  useGetMissionSection,
  useGetReservationSection,
} from "../../hooks/useThridParty";
import TaskCard from "../../components/_WorkComponents/workcard";

const WorkManagement = () => {
  const {
    data: workData,
    isLoading: isWorkLoading,
    isError: isWorkError,
    error: workError,
    refetch: refetchWork,
  } = useGetWorkSection();

  const { data: missionData, isLoading: isMissionLoading } = useGetMissionSection();
  const { data: reservationData, isLoading: isReservationLoading } = useGetReservationSection();

  const work = workData ?? [];
  const mission = missionData ?? [];
  const reservation = reservationData ?? [];

  const isLoading = isWorkLoading || isMissionLoading || isReservationLoading;
  const isError = isWorkError;
  const isEmpty = work.length === 0 && mission.length === 0 && reservation.length === 0;

  return (
    <PageWrapper>
      <HeaderSection>
        <TitleGroup>
          <h2>작업 관리</h2>
          <p>로봇 작업(Work), 미션(Mission) 및 예약(Reservation) 상태를 모니터링합니다.</p>
        </TitleGroup>
      </HeaderSection>

      {isLoading && (
        <LoadingState>
          <Spinner />
          <p>작업 정보를 불러오는 중입니다...</p>
        </LoadingState>
      )}

      {isError && (
        <ErrorState>
          <p>{workError?.message || "ThirdParty 서버 통신에 실패했습니다."}</p>
          <RetryButton onClick={() => refetchWork()}>다시 시도</RetryButton>
        </ErrorState>
      )}

      {!isLoading && !isError && isEmpty && (
        <EmptyState>
          <p>등록된 작업 데이터가 없습니다.</p>
        </EmptyState>
      )}

      {!isLoading && !isError && !isEmpty && (
        <ContentContainer>
          {/* 1. 작업 (Work / TaskDto) 섹션 */}
          <Section>
            <SectionTitle>
              실행 중인 작업 목록 <span>({work.length}건)</span>
            </SectionTitle>
            {work.length > 0 ? (
              <GridContainer>
                {work.map((item, index) => (
                  <TaskCard key={item.id ?? index} data={item} type="work" />
                ))}
              </GridContainer>
            ) : (
              <SubEmptyState>진행 중인 작업이 없습니다.</SubEmptyState>
            )}
          </Section>

          {/* 2. 미션 (Mission / TaskConfigDto) 섹션 */}
          <Section>
            <SectionTitle>
              미션 설정 목록 <span>({mission.length}건)</span>
            </SectionTitle>
            {mission.length > 0 ? (
              <GridContainer>
                {mission.map((item, index) => (
                  <TaskCard key={item.id ?? index} data={item} type="mission" />
                ))}
              </GridContainer>
            ) : (
              <SubEmptyState>등록된 미션 설정이 없습니다.</SubEmptyState>
            )}
          </Section>

          {/* 3. 예약 (Reservation) 섹션 */}
          <Section>
            <SectionTitle>
              예약 작업 목록 <span>({reservation.length}건)</span>
            </SectionTitle>
            {reservation.length > 0 ? (
              <GridContainer>
                {reservation.map((item, index) => (
                  <TaskCard key={item.id ?? index} data={item} type="reservation" />
                ))}
              </GridContainer>
            ) : (
              <SubEmptyState>예약된 작업이 없습니다.</SubEmptyState>
            )}
          </Section>
        </ContentContainer>
      )}
    </PageWrapper>
  );
};

export default WorkManagement;

// ── Styled Components ──────────────────────────────────────────

const PageWrapper = styled.div`
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