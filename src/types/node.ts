
export interface BoolSignal {
  Key: string;
  Value: boolean;
}

/** LineStorageData (스토리지 신호: Key, Value(문자열 carrierId)) */
export interface StorageSignal {
  Key: string;
  Value: string;
}

/** LineInfo 응답 (미들웨어 LineInformationData) */
export interface LineInfo {
  mapCode: string;
  lineName: string;
  _Call: BoolSignal[];
  _EmptyChangeReady: BoolSignal[];
  _FullChangeReady: BoolSignal[];
  _ChangeComplete: BoolSignal[];
  _StorageStatus: StorageSignal[];
  _BypassStatus: boolean;
  _BypassPosition: boolean;
  _EmergencyStop: boolean;
}

/** 지도 포인트(노드) 응답 항목 (신 미들웨어 MapPointDto) */
export interface MapPointInfo {
  dataCode: string;
  x: number;
  y: number;
  dataType: string;
}

/** 지도 라인(엣지) 응답 항목 (신 미들웨어 MapLineDto) */
export interface MapLineInfo {
  lineCode: string;
  nodeStart: string;
  nodeEnd: string;
}

/** 지도 상세(노드+엣지) 응답 (신 미들웨어 MapDetailsDto) */
export interface MapDetailsInfo {
  points: MapPointInfo[];
  lines: MapLineInfo[];
}