import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';

import { fetchRobotStatus as fetchRobotStatusApi, fetchNodeStatus, fetchEdgeStatus } from '../../api/Info';
import type { RobotStatus } from '../../types/device';
import type { NodeInfo, EdgeInfo } from '../../types/node';
import BottomModal from '../../components/_ModalComponents/bottommodal';

// ============================================================
// Constants
// ============================================================

const BASE_SCALE = 35;
const OFFSET_X = 100;
const OFFSET_Y = 50;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 5;

const IDLE_POLL_INTERVAL = 5000;
const ERROR_POLL_INTERVAL = 10000;

// ============================================================
// Types
// ============================================================

type Transform = { scale: number; panX: number; panY: number };

type SelectedInfo =
  | { type: 'robot'; data: RobotStatus }
  | { type: 'node'; data: NodeInfo }
  | null;

// 랙 노드(functionType 14)는 초록, 나머지는 파랑
const nodeColor = (functionType: number) => (functionType === 14 ? '#4caf50' : '#2196f3');

export default function AmrMapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [transform, setTransform] = useState<Transform>({ scale: 1, panX: 0, panY: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragMovedRef = useRef(false);

  const [nodes, setNodes] = useState<NodeInfo[]>([]);
  const [edges, setEdges] = useState<EdgeInfo[]>([]);
  const [robotData, setRobotData] = useState<RobotStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<SelectedInfo>(null);

  const [currentInterval, setCurrentInterval] = useState(IDLE_POLL_INTERVAL);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollingRef = useRef(false);
  const mountedRef = useRef(false);

  const canvasSizeRef = useRef({ width: 0, height: 0, dpr: 1 });

  // nodeLabel -> NodeInfo 조회용
  const nodeMap = useMemo(() => {
    const m = new Map<string, NodeInfo>();
    for (const n of nodes) m.set(n.nodeLabel, n);
    return m;
  }, [nodes]);

  // ========================================================
  // 지도(노드/엣지) 1회 로드
  // ========================================================

  useEffect(() => {
    Promise.all([fetchNodeStatus(), fetchEdgeStatus()])
      .then(([n, e]) => {
        setNodes(n ?? []);
        setEdges(e ?? []);
      })
      .catch((err) => console.error('지도 로드 실패:', err));
  }, []);

  // ========================================================
  // 로봇 상태 폴링
  // ========================================================

  const fetchStatusAndGetNextInterval = useCallback(async (isInitial = false): Promise<number> => {
    if (isInitial) setLoading(true);
    try {
      const data = await fetchRobotStatusApi();
      if (!mountedRef.current) return IDLE_POLL_INTERVAL;
      setRobotData(data);
      setError(null);
      return IDLE_POLL_INTERVAL;
    } catch (err) {
      console.error('Robot status polling error:', err);
      if (isInitial && mountedRef.current) setError('로봇 서버에 연결할 수 없습니다.');
      return ERROR_POLL_INTERVAL;
    } finally {
      if (isInitial && mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const runPolling = async (isInitial = false) => {
      if (pollingRef.current) return;
      pollingRef.current = true;
      try {
        const nextInterval = await fetchStatusAndGetNextInterval(isInitial);
        if (!mountedRef.current) return;
        setCurrentInterval(nextInterval);
        timerRef.current = setTimeout(() => {
          pollingRef.current = false;
          runPolling(false);
        }, nextInterval);
      } catch {
        pollingRef.current = false;
        if (mountedRef.current) {
          timerRef.current = setTimeout(() => runPolling(false), ERROR_POLL_INTERVAL);
        }
      }
    };
    runPolling(true);
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [fetchStatusAndGetNextInterval]);

  // ========================================================
  // World -> Canvas
  // ========================================================

  const worldToCanvas = useCallback(
    (x: number, y: number) => {
      const { height } = canvasSizeRef.current;
      const worldX = (x - 5) * BASE_SCALE + OFFSET_X;
      const worldY = height - ((y - 4) * BASE_SCALE + OFFSET_Y);
      return { x: worldX * transform.scale + transform.panX, y: worldY * transform.scale + transform.panY };
    },
    [transform],
  );

  // ========================================================
  // Resize
  // ========================================================

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = window.innerHeight * 0.8;
    canvasSizeRef.current = { width, height, dpr };
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  const drawArrowhead = useCallback(
    (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) => {
      const headLength = 10 * Math.max(0.7, Math.min(transform.scale, 1.5));
      const angle = Math.atan2(toY - fromY, toX - fromX);
      const midX = (fromX + toX) / 2;
      const midY = (fromY + toY) / 2;
      ctx.fillStyle = '#ff9800';
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(midX - headLength * Math.cos(angle - Math.PI / 6), midY - headLength * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(midX - headLength * Math.cos(angle + Math.PI / 6), midY - headLength * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    },
    [transform.scale],
  );

  const renderMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height, dpr } = canvasSizeRef.current;
    if (width <= 0 || height <= 0) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // 엣지
    edges.forEach((edge) => {
      const start = nodeMap.get(edge.beginNodeLabel);
      const end = nodeMap.get(edge.endNodeLabel);
      if (!start || !end) return;
      const sp = worldToCanvas(start.xCoordinate, start.yCoordinate);
      const ep = worldToCanvas(end.xCoordinate, end.yCoordinate);
      const isBothWay = edge.isEdgeBothWay;
      ctx.beginPath();
      ctx.moveTo(sp.x, sp.y);
      ctx.lineTo(ep.x, ep.y);
      ctx.strokeStyle = isBothWay ? '#555555' : '#ff9800';
      ctx.lineWidth = (isBothWay ? 2 : 3) * transform.scale;
      ctx.setLineDash(isBothWay ? [] : [6 * transform.scale, 4 * transform.scale]);
      ctx.stroke();
      ctx.setLineDash([]);
      if (!isBothWay) drawArrowhead(ctx, sp.x, sp.y, ep.x, ep.y);
    });

    // 노드
    nodes.forEach((node) => {
      const { x: cx, y: cy } = worldToCanvas(node.xCoordinate, node.yCoordinate);
      const radius = 9 * Math.max(0.6, Math.min(transform.scale, 1.8));
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor(node.functionType);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(10, 12 * Math.min(transform.scale, 1.5))}px Arial`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(`N${node.nodeLabel}`, cx + radius + 4, cy + 4);
    });

    // 로봇
    robotData.forEach((robot) => {
      const { x: cx, y: cy } = worldToCanvas(robot.x, robot.y);
      const size = 16 * Math.max(0.6, Math.min(transform.scale, 1.8));
      const half = size / 2;
      ctx.beginPath();
      ctx.rect(cx - half, cy - half, size, size);
      ctx.fillStyle = '#ffcc00';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(10, 12 * Math.min(transform.scale, 1.5))}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(robot.robotId, cx, cy - half - 6);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
    });
  }, [edges, nodes, nodeMap, robotData, transform.scale, worldToCanvas, drawArrowhead]);

  useEffect(() => {
    resizeCanvas();
    renderMap();
    const container = containerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      renderMap();
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [resizeCanvas, renderMap]);

  useEffect(() => {
    renderMap();
  }, [renderMap]);

  // ========================================================
  // Zoom / Drag
  // ========================================================

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const zoomFactor = Math.exp(-e.deltaY * 0.0015);
    setTransform((prev) => {
      const newScale = Math.min(Math.max(prev.scale * zoomFactor, MIN_ZOOM), MAX_ZOOM);
      const scaleRatio = newScale / prev.scale;
      const canvas = canvasRef.current;
      if (!canvas) return prev;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      return {
        scale: newScale,
        panX: mouseX - (mouseX - prev.panX) * scaleRatio,
        panY: mouseY - (mouseY - prev.panY) * scaleRatio,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      setIsDragging(true);
      dragMovedRef.current = false;
      dragStartRef.current = { x: e.clientX - transform.panX, y: e.clientY - transform.panY };
    },
    [transform.panX, transform.panY],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDragging) return;
      const newPanX = e.clientX - dragStartRef.current.x;
      const newPanY = e.clientY - dragStartRef.current.y;
      if (Math.abs(newPanX - transform.panX) > 2 || Math.abs(newPanY - transform.panY) > 2) {
        dragMovedRef.current = true;
      }
      setTransform((prev) => ({ ...prev, panX: newPanX, panY: newPanY }));
    },
    [isDragging, transform.panX, transform.panY],
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);
  const zoomIn = useCallback(() => setTransform((p) => ({ ...p, scale: Math.min(p.scale * 1.2, MAX_ZOOM) })), []);
  const zoomOut = useCallback(() => setTransform((p) => ({ ...p, scale: Math.max(p.scale / 1.2, MIN_ZOOM) })), []);
  const resetTransform = useCallback(() => setTransform({ scale: 1, panX: 0, panY: 0 }), []);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (dragMovedRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      for (const robot of robotData) {
        const { x: cx, y: cy } = worldToCanvas(robot.x, robot.y);
        const half = (16 * Math.max(0.6, Math.min(transform.scale, 1.8))) / 2;
        if (mouseX >= cx - half && mouseX <= cx + half && mouseY >= cy - half && mouseY <= cy + half) {
          setSelectedInfo({ type: 'robot', data: robot });
          return;
        }
      }
      for (const node of nodes) {
        const { x: cx, y: cy } = worldToCanvas(node.xCoordinate, node.yCoordinate);
        const radius = 9 * Math.max(0.6, Math.min(transform.scale, 1.8));
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        if (dx * dx + dy * dy <= radius * radius) {
          setSelectedInfo({ type: 'node', data: node });
          return;
        }
      }
    },
    [robotData, nodes, transform.scale, worldToCanvas],
  );

  return (
    <MapLayout ref={containerRef}>
      <CanvasContainer>
        <StyledCanvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        />
        <ControlPanel>
          <ControlButton onClick={zoomIn}>+</ControlButton>
          <ControlButton onClick={zoomOut}>-</ControlButton>
          <ControlButton onClick={resetTransform}>Reset</ControlButton>
        </ControlPanel>
      </CanvasContainer>

      <StatusBar>
        {loading && <StatusText>로봇 상태 조회 중...</StatusText>}
        {!loading && <StatusText>Polling: {currentInterval / 1000}s</StatusText>}
        {error && <ErrorText>{error}</ErrorText>}
      </StatusBar>

      <Legend>
        <span style={{ color: '#2196f3' }}>● 일반 노드</span>
        {' | '}
        <span style={{ color: '#4caf50' }}>● 랙 노드(14)</span>
        {' | '}
        <span style={{ color: '#888' }}>─ 양방향 경로</span>
        {' | '}
        <span style={{ color: '#ff9800' }}>╌ 단방향 경로</span>
      </Legend>

      {selectedInfo && <BottomModal info={selectedInfo} onClose={() => setSelectedInfo(null)} />}
    </MapLayout>
  );
}

// ============================================================
// Styled Components
// ============================================================

const MapLayout = styled.div`
  width: 100%;
  background-color: #161616;
  color: #fff;
  padding: 16px;
  box-sizing: border-box;
`;

const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledCanvas = styled.canvas`
  display: block;
  width: 100%;
  height: 80vh;
  background-color: #1a1a1a;
  border: 2px solid #333;
  border-radius: 8px;
  touch-action: none;
  user-select: none;
`;

const ControlPanel = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ControlButton = styled.button`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2a2a2a;
  color: #ffffff;
  border: 1px solid #444;
  border-radius: 4px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  &:hover {
    background-color: #3a3a3a;
  }
`;

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 20px;
  margin-top: 8px;
  font-size: 12px;
`;

const StatusText = styled.span`
  color: #777;
`;

const ErrorText = styled.span`
  color: #ff5252;
`;

const Legend = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #aaa;
`;