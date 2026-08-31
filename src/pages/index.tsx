import styled from "@emotion/styled";
import DashboardCard from "../components/_CommonComponents/_Dashboard/dashboardcard";

const App = () => {
  return (
    <Container>
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

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 32px;
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