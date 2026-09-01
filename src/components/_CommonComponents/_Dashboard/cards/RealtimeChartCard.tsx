import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import Dygraph from "dygraphs";
import "dygraphs/dist/dygraph.min.css";
import { useGetRobotStatus } from "../../../../hooks/useThridParty";

const MAX_POINTS = 30;

type SeriesPoint = [Date, number, number];

const RealtimeChartCard = () => {
    const { data: robots } = useGetRobotStatus();
    const chartRef = useRef<HTMLDivElement>(null);
    const [series, setSeries] = useState<SeriesPoint[]>([]);

    useEffect(() => {
        const list = robots ?? [];
        if (list.length === 0) return;

        const driving = list.filter((r) => r.driving).length;
        const loaded = list.filter((r) => r.load).length;
        const availability = Math.round((driving / list.length) * 100);
        const loadRate = Math.round((loaded / list.length) * 100);

        setSeries((prev) => {
            const next: SeriesPoint[] = [...prev, [new Date(), availability, loadRate]];
            return next.length > MAX_POINTS ? next.slice(next.length - MAX_POINTS) : next;
        });
    }, [robots]);

    useEffect(() => {
        if (!chartRef.current || series.length === 0) return;

        const dygraph = new Dygraph(chartRef.current, series, {
            labels: ["시간", "로봇 가동률", "기기 부하율"],
            colors: ["#7e22ce", "#e11d48"],
            strokeWidth: 2,
            legend: "onmouseover",
            animatedZooms: true,
        });

        const handleResize = () => dygraph.resize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            dygraph.destroy();
        };
    }, [series]);

    return (
        <Wrapper>
            <CardHeader><p>실시간 상태 추이</p></CardHeader>
            {series.length === 0 ? <EmptyText>상태 데이터를 수집 중입니다...</EmptyText> : <ChartWrapper ref={chartRef} />}
        </Wrapper>
    );
};

export default RealtimeChartCard;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  gap: 12px;
`;

const CardHeader = styled.div`
  width: 100%;
  p { font-size: 14px; font-weight: 700; color: #581c87; margin: 0; }
`;

const ChartWrapper = styled.div`
  width: 100%;
  flex: 1;
  min-height: 180px;
`;

const EmptyText = styled.p`
  flex: 1;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a855f7;
  font-size: 13px;
  margin: 0;
`;