// ── ConnectionInfo (DigitalTwin ConnectionInformationData) ─────
// 미들웨어의 각 대외 연결 상태를 나타낸다.
export interface ConnectionInfo {
  /** TUSK REST 도달 가능 여부 (IsLotharConnected) */
  tuskStatus: boolean;
  /** TUSK 실시간(WebSocket) 채널 생존 여부 */
  tuskRealtimeStatus: boolean;
  /** feedbackTask 콜백 수신 서버 바인드 여부 */
  amrCallbackServerStatus: boolean;
  /** Modbus 서버 연결 여부 */
  modbusStatus: boolean;
}