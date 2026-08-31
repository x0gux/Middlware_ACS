// ── 노드/엣지/라인 (DigitalTwin NodeInfo · EdgeInfo · LineInfo) ──

/** LineBooleanData (boolean 신호: Key, Value) */
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

/** NodeInfo 응답 항목 (미들웨어 NodeInformation) */
export interface NodeInfo {
  mapCode: string;
  nodeCode: string;
  nodeLabel: string;
  externalCode: string;
  functionType: number;
  containerModelCode: string[];
  containerStopAngle: string;
  xCoordinate: number;
  yCoordinate: number;
}

/** EdgeInfo 응답 항목 (미들웨어 EdgeInformation) */
export interface EdgeInfo {
  mapCode: string;
  beginNodeLabel: string;
  endNodeLabel: string;
  isEdgeBothWay: boolean;
}