import styled from "@emotion/styled";

const MiniMapCard = () => {
    return (
        <Wrapper>
            <CardHeader><p>실시간 관제 미니맵</p></CardHeader>
            <MapCanvasPlaceholder>
                <MapNode style={{ top: "20%", left: "20%" }}>N1</MapNode>
                <MapNode style={{ top: "20%", left: "70%" }}>N2</MapNode>
                <MapNode style={{ top: "70%", left: "30%" }}>N3</MapNode>
                <MapNode style={{ top: "70%", left: "80%" }}>N4</MapNode>
                <RobotIcon style={{ top: "18%", left: "40%" }} $status="active">🤖 AGV-01</RobotIcon>
                <RobotIcon style={{ top: "68%", left: "50%" }} $status="warning">⚠️ AMR-05</RobotIcon>
            </MapCanvasPlaceholder>
        </Wrapper>
    );
};

export default MiniMapCard;

const Wrapper = styled.div` display: flex; flex-direction: column; justify-content: space-between; height: 100%; gap: 12px; `;
const CardHeader = styled.div` width: 100%; p { font-size: 14px; font-weight: 700; color: #581c87; margin: 0; } `;
const MapCanvasPlaceholder = styled.div` width: 100%; flex: 1; min-height: 180px; background-color: #faf5ff; border: 1px dashed #d8b4fe; border-radius: 8px; position: relative; overflow: hidden; `;
const MapNode = styled.div` position: absolute; width: 24px; height: 24px; background: #e9d5ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #6b21a8; font-weight: bold; `;
const RobotIcon = styled.div<{ $status: "active" | "warning" }>` position: absolute; padding: 4px 8px; background: ${(props) => (props.$status === "active" ? "#7e22ce" : "#e11d48")}; color: #ffffff; border-radius: 12px; font-size: 11px; font-weight: bold; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); `;