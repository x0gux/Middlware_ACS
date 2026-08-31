import { useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";

import type { WorkingStatus } from "../../types/work";
import { fetchWorkSection, fetchMissionSection, fetchReservationSection } from "../../api/Info";
import WorkCard from "../../components/_WorkComponents/workcard";

type Tab = "working" | "mission" | "reservation";

const TABS: { key: Tab; label: string }[] = [
  { key: "working", label: "수행 중" },
  { key: "mission", label: "대기" },
  { key: "reservation", label: "예약" },
];

const FETCHER: Record<Tab, () => Promise<WorkingStatus[]>> = {
  working: fetchWorkSection,
  mission: fetchMissionSection,
  reservation: fetchReservationSection,
};

const WorkSection = () => {
  const [tab, setTab] = useState<Tab>("working");
  const [workData, setWorkData] = useState<WorkingStatus[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await FETCHER[tab]();
      setWorkData(data);
    } catch (err) {
      console.error(err);
      setError("서버에 연결할 수 없습니다. 서버가 켜져 있는지 확인하세요.");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <TabBar>
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </TabBar>

      {error && <p style={{ color: "red", whiteSpace: "pre-line", marginTop: 8 }}>{error}</p>}

      {workData && workData.length > 0 ? (
        <GridContainer>
          {workData.map((work, index) => (
            <WorkCard key={index} data={work} onChanged={load} />
          ))}
        </GridContainer>
      ) : (
        !loading && <p>데이터 없음</p>
      )}
    </div>
  );
};

export default WorkSection;

const TabBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${(p) => (p.active ? "#0f47ff" : "#ccc")};
  border-radius: 8px;
  background: ${(p) => (p.active ? "#0f47ff" : "#fff")};
  color: ${(p) => (p.active ? "#fff" : "#333")};
  cursor: pointer;
  font-family: 'PretendardVariable';
  &:hover {
    border-color: #0f47ff;
  }
`;

const GridContainer = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
`;