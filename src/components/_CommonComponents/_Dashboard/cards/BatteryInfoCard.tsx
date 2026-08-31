import styled from "@emotion/styled";

const BatteryInfoCard = () => {
    // 충전 진행 중: 4 / 6대 (66%)
    // 배터리 경고: 2대
    const chargingCount = 4;
    const totalStations = 6;
    const warningCount = 2;
    const chargingPercent = Math.round((chargingCount / totalStations) * 100);

    return (
        <Wrapper>
            <CardHeader><p>배터리 및 충전소</p></CardHeader>
            <ContentWrapper>
                {/* 원형 충전소 점유율 게이지 */}
                <CircularGauge $percent={chargingPercent}>
                    <GaugeCenter>
                        <span className="label">충전소 가동률</span>
                        <strong className="value">{chargingPercent}%</strong>
                        <span className="sub">({chargingCount}/{totalStations} 대)</span>
                    </GaugeCenter>
                </CircularGauge>

                {/* 하단 요약 정보 카드 (개선된 UI) */}
                <StatusGrid>
                    <StatusCard $type="purple">
                        <CardHeaderRow>

                            <span className="title">충전 중</span>
                        </CardHeaderRow>
                        <CountRow>
                            <strong className="highlight">{chargingCount}</strong>
                            <span className="total">/ {totalStations}대</span>
                        </CountRow>
                    </StatusCard>

                    <StatusCard $type="rose">
                        <CardHeaderRow>

                            <span className="title">배터리 경고</span>
                        </CardHeaderRow>
                        <CountRow>
                            <strong className="highlight">{warningCount}</strong>
                            <span className="total">대 (≤20%)</span>
                        </CountRow>
                    </StatusCard>
                </StatusGrid>
            </ContentWrapper>
        </Wrapper>
    );
};

export default BatteryInfoCard;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 16px;
`;

const CardHeader = styled.div`
  width: 100%;
  p {
    font-size: 14px;
    font-weight: 700;
    color: #581c87;
    margin: 0;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const CircularGauge = styled.div<{ $percent: number }>`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: conic-gradient(
    #a855f7 0% ${(props) => props.$percent}%,
    #e2e8f0 ${(props) => props.$percent}% 100%
  );
`;

const GaugeCenter = styled.div`
  width: 92px;
  height: 92px;
  background-color: #ffffff;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .label {
    font-size: 10px;
    color: #64748b;
  }
  .value {
    font-size: 18px;
    font-weight: 800;
    color: #334155;
    line-height: 1.2;
  }
  .sub {
    font-size: 10px;
    color: #94a3b8;
  }
`;

/* 하단 카드 레이아웃 스타일 개선 */
const StatusGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const StatusCard = styled.div<{ $type: "purple" | "rose" }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${(props) => (props.$type === "purple" ? "#f3e8ff" : "#ffe4e6")};
  background-color: ${(props) => (props.$type === "purple" ? "#faf5ff" : "#fff1f2")};
  transition: transform 0.15s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CardHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  .title {
    font-size: 16px;
    font-weight: 600;
    color: #475569;
    white-space: nowrap;
  }
`;

const CountRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 6px;

  .highlight {
    font-size: 20px;
    font-weight: 800;
    color: #1e293b;
    line-height: 1;
  }
  .total {
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
  }
`;