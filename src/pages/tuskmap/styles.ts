import styled from '@emotion/styled';

export const MapLayout = styled.div`
  width: 100%;
  min-height: 100%;
  background-color: #161616;
  color: #ffffff;
  padding: 16px;
  box-sizing: border-box;
`;

export const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  background: radial-gradient(circle at center, #222222 0%, #181818 65%, #141414 100%);
  border-radius: 8px;
`;

export const StyledCanvas = styled.canvas`
  display: block;
  width: 100%;
  height: 80vh;
  min-height: 500px;
  background-color: #1a1a1a;
  border: 2px solid #333333;
  border-radius: 8px;
  touch-action: none;
  user-select: none;
`;

export const ControlPanel = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 20;
`;

export const ControlButton = styled.button`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(42, 42, 42, 0.92);
  color: #ffffff;
  border: 1px solid #555555;
  border-radius: 6px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s, transform 0.1s;

  &:hover {
    background-color: #3a3a3a;
  }

  &:active {
    transform: scale(0.94);
  }
`;

export const MapInfo = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 13px;
  background: rgba(20, 20, 20, 0.85);
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  font-size: 12px;
  color: #999999;
  pointer-events: none;
`;

export const MapInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  strong {
    color: #ffffff;
  }
`;

export const MapStatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4caf50;
  box-shadow: 0 0 6px rgba(76, 175, 80, 0.8);
`;

export const StatusBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 22px;
  margin-top: 8px;
  font-size: 12px;
`;

export const StatusText = styled.span`
  color: #777777;
`;

export const ErrorText = styled.span`
  color: #ff5252;
`;

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-top: 10px;
  padding: 8px 10px;
  font-size: 13px;
  color: #aaaaaa;
  background: #1d1d1d;
  border: 1px solid #292929;
  border-radius: 6px;
`;

export const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
`;

export const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid #ffffff;
  box-sizing: border-box;
`;

export const LegendLine = styled.span`
  width: 22px;
  height: 3px;
  background: #e8edf2;
  border-radius: 2px;
`;

export const LegendRobot = styled.span`
  width: 11px;
  height: 11px;
  background: #ffcc00;
  border: 1px solid #ffffff;
  box-sizing: border-box;
`;