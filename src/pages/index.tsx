import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { fetchConnectionInfo } from "../api/Info";
import type { ConnectionInfo } from "../types/connection";

interface StatusItem {
  label: string;
  value: boolean;
  connectedText: string;
  disconnectedText: string;
}

const App = () => {
  const [connection, setConnection] = useState<ConnectionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConnectionInfo()
      .then((data) => setConnection(data[0] ?? null))
      .catch((e) => {
        console.error(e);
        setError("미들웨어(DigitalTwin) 서버에 연결할 수 없습니다.");
      });
  }, []);

  const items: StatusItem[] = connection
    ? [
        { label: "TUSK(REST) 연결", value: connection.tuskStatus, connectedText: "연결됨", disconnectedText: "끊김" },
        { label: "TUSK 실시간(WS)", value: connection.tuskRealtimeStatus, connectedText: "연결됨", disconnectedText: "끊김" },
        { label: "콜백 수신 서버", value: connection.amrCallbackServerStatus, connectedText: "가동 중", disconnectedText: "중지" },
        { label: "Modbus 서버", value: connection.modbusStatus, connectedText: "연결됨", disconnectedText: "끊김" },
      ]
    : [];

  return (
    <Container>
      <h2>대시보드</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {connection && (
        <Grid>
          {items.map((item) => (
            <StatusCard key={item.label}>
              <Label>{item.label}</Label>
              <Value ok={item.value}>
                {item.value ? item.connectedText : item.disconnectedText}
              </Value>
            </StatusCard>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default App;

const Container = styled.div`
  padding: 24px;
  font-family: 'PretendardVariable', sans-serif;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const StatusCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 20px;
  background: #fff;
`;

const Label = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 8px;
`;

const Value = styled.p<{ ok: boolean }>`
  font-size: 20px;
  font-weight: 700;
  color: ${(p) => (p.ok ? "#2e7d32" : "#d32f2f")};
  margin: 0;
`;