import styled from "@emotion/styled";

const BatteryInfoCard = () => {
    return (
        <Wrapper>
            <CardHeader><p>배터리 및 충전소</p></CardHeader>
            <BatteryContent>
                <BatteryItem>
                    <span>충전 진행 중</span>
                    <ProgressWrapper><ProgressBar width="66%" color="#a855f7" /></ProgressWrapper>
                    <strong>4 / 6 대</strong>
                </BatteryItem>
                <BatteryItem>
                    <span>배터리 경고 (20% 이하)</span>
                    <ProgressWrapper><ProgressBar width="20%" color="#f43f5e" /></ProgressWrapper>
                    <strong style={{ color: "#f43f5e" }}>2 대</strong>
                </BatteryItem>
            </BatteryContent>
        </Wrapper>
    );
};

export default BatteryInfoCard;

const Wrapper = styled.div` display: flex; flex-direction: column; justify-content: space-between; height: 100%; gap: 12px; `;
const CardHeader = styled.div` width: 100%; p { font-size: 14px; font-weight: 700; color: #581c87; margin: 0; } `;
const BatteryContent = styled.div` width: 100%; flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 10px; `;
const BatteryItem = styled.div` display: flex; align-items: center; gap: 8px; font-size: 12px; color: #475569; span { width: 110px; } strong { width: 50px; text-align: right; } `;
const ProgressWrapper = styled.div` flex: 1; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; `;
const ProgressBar = styled.div<{ width: string; color: string }>` width: ${(props) => props.width}; height: 100%; background-color: ${(props) => props.color}; border-radius: 4px; `;