import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import Dygraph from "dygraphs";
import "dygraphs/dist/dygraph.min.css";

interface Props {
    chartData?: Array<[Date, number, number]>;
}

const RealtimeChartCard = ({ chartData }: Props) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const defaultData: Array<[Date, number, number]> = [
            [new Date("2026-08-31 10:00"), 10, 20],
            [new Date("2026-08-31 11:00"), 25, 18],
            [new Date("2026-08-31 12:00"), 15, 30],
            [new Date("2026-08-31 13:00"), 35, 25],
        ];

        const dygraph = new Dygraph(chartRef.current, chartData ?? defaultData, {
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
    }, [chartData]);

    return (
        <Wrapper>
            <CardHeader><p>실시간 상태 추이</p></CardHeader>
            <ChartWrapper ref={chartRef} />
        </Wrapper>
    );
};

export default RealtimeChartCard;

const Wrapper = styled.div` display: flex; flex-direction: column; justify-content: space-between; height: 100%; gap: 12px; `;
const CardHeader = styled.div` width: 100%; p { font-size: 14px; font-weight: 700; color: #581c87; margin: 0; } `;
const ChartWrapper = styled.div` width: 100%; flex: 1; min-height: 180px; `;