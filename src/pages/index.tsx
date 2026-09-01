import styled from "@emotion/styled";
import DashboardCard from "../components/_CommonComponents/_Dashboard/dashboardcard";

const App = () => {
  return (
    <Container>

      <HeaderSection>
        <TitleGroup>
          <h2>대시보드</h2>
          <p>미들웨어에 연결된 AMR/AGV 로봇들의 정보를 모니터링합니다.</p>
        </TitleGroup>
      </HeaderSection>
      <SummarySection>
        <DashboardCard type="_ActiveRobot" />
        <DashboardCard type="_Device_all" />
        <DashboardCard type="_Device_error" />
        <DashboardCard type="_Chart" />
        <DashboardCard type="_Task_summary" />
        <DashboardCard type="_Battery_info" />
        <DashboardCard type="_Recent_alerts" />
      </SummarySection>
    </Container>
  );
};

export default App;

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

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SummarySection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  align-items: stretch;
`;