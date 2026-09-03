// ============================================================
// 지도/캔버스 상수
// ============================================================

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 5;

export const IDLE_POLL_INTERVAL = 5000;
export const ERROR_POLL_INTERVAL = 10000;

// public/map.svg 실제 픽셀 크기
export const MAP_SVG = {
  width: 2589,
  height: 668,
};

// API World 좌표 범위 (fetchMapDetails 결과 기준)
export const WORLD_BOUNDS = {
  minX: 2.783,
  maxX: 25.5,
  minY: 3.42,
  maxY: 8.507,
};

// SVG 내 실제 노드가 배치될 영역 비율 (배치 미세조정용)
export const NODE_AREA = {
  left: 0.075,
  right: 0.94,
  top: 0.2,
  bottom: 0.68,
};

// 노드/로봇 아이콘 기본 픽셀 크기 (줌 배율과 곱하여 표시)
export const NODE_ICON_SIZE = 22;
export const ROBOT_ICON_SIZE = 28;

export const NODE_COLORS = {
  storage: '#4caf50',
  charging: '#ff9800',
  workstation: '#2196f3',
  default: '#2196f3',
} as const;

// 노드 dataType별 색상
export function nodeColor(dataType: string): string {
  switch (dataType) {
    case 'StoragePoint':
      return NODE_COLORS.storage;
    case 'ChargingPoint':
      return NODE_COLORS.charging;
    case 'Workstation':
      return NODE_COLORS.workstation;
    default:
      return NODE_COLORS.default;
  }
}