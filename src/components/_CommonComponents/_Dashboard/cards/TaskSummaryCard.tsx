import styled from "@emotion/styled";

const TaskSummaryCard = () => {
    const taskData = { pending: 8, inProgress: 14, completed: 142, failed: 2 };
    const total = taskData.pending + taskData.inProgress + taskData.completed + taskData.failed;

    const p1 = (taskData.completed / total) * 100;
    const p2 = p1 + (taskData.inProgress / total) * 100;
    const p3 = p2 + (taskData.pending / total) * 100;

    return (
        <Wrapper>
            <CardHeader><p>작업 처리 현황</p></CardHeader>
            <TaskChartWrapper>
                <DonutChart $p1={p1} $p2={p2} $p3={p3}>
                    <DonutCenter>
                        <span>전체 작업</span>
                        <strong>{total}건</strong>
                    </DonutCenter>
                </DonutChart>

                <ChartLegend>
                    <LegendItem $color="#16a34a">
                        <span className="dot" /><span className="label">완료</span><strong>{taskData.completed}</strong>
                    </LegendItem>
                    <LegendItem $color="#2563eb">
                        <span className="dot" /><span className="label">진행 중</span><strong>{taskData.inProgress}</strong>
                    </LegendItem>
                    <LegendItem $color="#7e22ce">
                        <span className="dot" /><span className="label">대기 중</span><strong>{taskData.pending}</strong>
                    </LegendItem>
                    <LegendItem $color="#dc2626">
                        <span className="dot" /><span className="label">지연/실패</span><strong>{taskData.failed}</strong>
                    </LegendItem>
                </ChartLegend>
            </TaskChartWrapper>
        </Wrapper>
    );
};

export default TaskSummaryCard;

const Wrapper = styled.div`
  display: flex; 
  flex-direction: column; 
  height: 100%; 
  gap: 16px;
`;

const CardHeader = styled.div` 
  width: 100%; 
  p { font-size: 14px; font-weight: 700; color: #581c87; margin: 0; } 
`;


const TaskChartWrapper = styled.div` 
  width: 100%; 
  flex: 1; 
  display: flex; 
  flex-direction: column;
  align-items: center; 
  justify-content: center; 
  gap: 20px; 
`;

const DonutChart = styled.div<{ $p1: number; $p2: number; $p3: number }>`
  width: 200px; 
  height: 200px; 
  border-radius: 50%; 
  position: relative; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  flex-shrink: 0;
  background: conic-gradient(
    #16a34a 0% ${(props) => props.$p1}%, 
    #2563eb ${(props) => props.$p1}% ${(props) => props.$p2}%, 
    #7e22ce ${(props) => props.$p2}% ${(props) => props.$p3}%, 
    #dc2626 ${(props) => props.$p3}% 100%
  );
`;

/* 중앙 원 및 폰트 크기 확대 */
const DonutCenter = styled.div`
  width: 90px; 
  height: 90px; 
  background-color: #ffffff; 
  border-radius: 50%; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center;
  span { font-size: 11px; color: #64748b; } 
  strong { font-size: 16px; font-weight: 800; color: #334155; }
`;

/* 범주 아이템들을 하단에서 2컬럼 grid 또는 가로 배치에 적합하도록 정렬 */
const ChartLegend = styled.div` 
  width: 100%; 
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px; 
`;

const LegendItem = styled.div<{ $color: string }>`
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  font-size: 16px;
  .dot { width: 8px; height: 8px; border-radius: 50%; background-color: ${(props) => props.$color}; margin-right: 6px; }
  .label { flex: 1; color: #64748b; } 
  strong { font-weight: 700; color: #334155; }
`;