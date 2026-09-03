import {
  ControlPanel,
  ControlButton,
  MapInfo,
  MapInfoRow,
  MapStatusDot,
  StatusBar,
  StatusText,
  ErrorText,
  Legend,
  LegendItem,
  LegendDot,
  LegendLine,
  LegendRobot,
} from '../../pages/tuskmap/styles';

export function ZoomControls({
  onZoomIn,
  onZoomOut,
  onReset,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}) {
  return (
    <ControlPanel>
      <ControlButton onClick={onZoomIn}>+</ControlButton>
      <ControlButton onClick={onZoomOut}>−</ControlButton>
      <ControlButton onClick={onReset}>Reset</ControlButton>
    </ControlPanel>
  );
}

export function MapInfoPanel({
  nodeCount,
  robotCount,
}: {
  nodeCount: number;
  robotCount: number;
}) {
  return (
    <MapInfo>
      <MapInfoRow>
        <MapStatusDot />
        <span>AMR MAP</span>
      </MapInfoRow>
      <MapInfoRow>
        Node&nbsp;
        <strong>{nodeCount}</strong>
      </MapInfoRow>
      <MapInfoRow>
        Robot&nbsp;
        <strong>{robotCount}</strong>
      </MapInfoRow>
    </MapInfo>
  );
}

export function StatusBarView({
  loading,
  currentInterval,
  error,
}: {
  loading: boolean;
  currentInterval: number;
  error: string | null;
}) {
  return (
    <StatusBar>
      {loading && <StatusText>로봇 상태 조회 중...</StatusText>}
      {!loading && (
        <StatusText>Polling: {currentInterval / 1000}s</StatusText>
      )}
      {error && <ErrorText>{error}</ErrorText>}
    </StatusBar>
  );
}

export function MapLegend() {
  return (
    <Legend>
      <LegendItem>
        <LegendDot style={{ background: '#2196f3' }} />
        일반 / Workstation
      </LegendItem>
      <LegendItem>
        <LegendDot style={{ background: '#ff9800' }} />
        ChargingPoint
      </LegendItem>
      <LegendItem>
        <LegendDot style={{ background: '#4caf50' }} />
        StoragePoint
      </LegendItem>
      <LegendItem>
        <LegendLine />
        경로
      </LegendItem>
      <LegendItem>
        <LegendRobot />
        Robot
      </LegendItem>
    </Legend>
  );
}