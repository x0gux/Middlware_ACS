import { useState, useEffect, useRef, useCallback } from "react";
import type { RobotStatus } from "../../types/device";
import { fetchRobotStatus as fetchRobotStatusApi } from "../../api/Info";
import DeviceCard from "../../components/_DeviceComponents/devicecard";
import styled from "@emotion/styled";

const DeviceManagement = () => {
  const [robotData, setRobotData] = useState<RobotStatus[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchStatusAndGetNextInterval = useCallback(async (isInitial = false): Promise<number> => {
    if (isInitial) setLoading(true);
    try {
      const data = await fetchRobotStatusApi();
      setRobotData(data);
      setError(null);
      const anyWorking = data.some((r) => r.taskId && r.taskId !== "");
      if (document.hidden) return 15000;
      if (anyWorking) return 1500;
      return 5000;
    } catch (err) {
      console.error(err);
      if (isInitial) setError("로봇 서버에 연결할 수 없습니다.");
      return 10000;
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const runPolling = async (isInitial = false) => {
      const nextInterval = await fetchStatusAndGetNextInterval(isInitial);
      if (!isMounted) return;
      timerRef.current = setTimeout(() => runPolling(false), nextInterval);
    };
    runPolling(true);
    return () => {
      isMounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [fetchStatusAndGetNextInterval]);

  return (
    <div>
      {loading && <p>로봇 상태를 불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {robotData && robotData.length > 0 ? (
        <GridContainer>
          {robotData.map((robot, index) => (
            <DeviceCard key={robot.robotId ?? index} data={robot} />
          ))}
        </GridContainer>
      ) : (
        !loading && <p>데이터 없음</p>
      )}
    </div>
  );
};

export default DeviceManagement;

const GridContainer = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
`;