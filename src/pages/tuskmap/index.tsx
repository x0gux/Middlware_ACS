import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';

import BottomModal from '../../components/_ModalComponents/bottommodal';

import {
  MIN_ZOOM,
  MAX_ZOOM,
  NODE_ICON_SIZE,
  ROBOT_ICON_SIZE,
} from '../../libs/constants';
import type { Transform, SelectedInfo } from '../../types/map';
import { computeMapArea, worldToCanvas } from '../../libs/mapGeometry';
import { renderScene } from '../../libs/renderer';
import { MapLayout, CanvasContainer, StyledCanvas } from './styles';
import {
  ZoomControls,
  MapInfoPanel,
  StatusBarView,
  MapLegend,
} from '../../components/_MapComponents/components';
import { useMapData, useMapImage, useMapIcons, useRobotPolling } from '../../hooks/hooks';

export default function AmrMapCanvas() {
  // ==========================================================
  // Refs
  // ==========================================================

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasSizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragMovedRef = useRef(false);

  // ==========================================================
  // State
  // ==========================================================

  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    panX: 0,
    panY: 0,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<SelectedInfo>(null);

  // ==========================================================
  // Data (지도 + 로봇)
  // ==========================================================

  const { nodes, edges, nodeMap } = useMapData();
  const { robotData, loading, error, currentInterval } = useRobotPolling();

  // map.svg 로드 후 최신 renderMap을 다시 호출하기 위한 경로
  const renderMapRef = useRef<(() => void) | null>(null);

  const notifyImageLoaded = useCallback(() => {
    renderMapRef.current?.();
  }, []);

  const { mapImageRef } = useMapImage(notifyImageLoaded);
  const { iconsRef } = useMapIcons(notifyImageLoaded);

  // ==========================================================
  // Canvas Resize
  // ==========================================================

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = Math.max(500, window.innerHeight * 0.8);
    const dpr = window.devicePixelRatio || 1;

    canvasSizeRef.current = { width, height, dpr };

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  // ==========================================================
  // Render Map
  // ==========================================================

  const renderMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const { width, height, dpr } = canvasSizeRef.current;
    if (width <= 0 || height <= 0) {
      return;
    }

    const map = computeMapArea(width, height);

    renderScene({
      ctx,
      width,
      height,
      dpr,
      mapImage: mapImageRef.current,
      icons: iconsRef.current,
      edges,
      nodes,
      nodeMap,
      robots: robotData,
      map,
      transform,
    });
  }, [edges, nodes, robotData, nodeMap, mapImageRef, iconsRef, transform]);

  useEffect(() => {
    renderMapRef.current = renderMap;
  }, [renderMap]);

  // ==========================================================
  // Resize Observer
  // ==========================================================

  useEffect(() => {
    resizeCanvas();
    renderMap();

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      renderMap();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [resizeCanvas, renderMap]);

  // ==========================================================
  // Data / Transform 변경 시 Render
  // ==========================================================

  useEffect(() => {
    renderMap();
  }, [renderMap]);

  // ==========================================================
  // Wheel Zoom
  // ==========================================================

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const zoomFactor = Math.exp(-e.deltaY * 0.0015);

    setTransform((prev) => {
      const newScale = Math.min(
        Math.max(prev.scale * zoomFactor, MIN_ZOOM),
        MAX_ZOOM,
      );

      const ratio = newScale / prev.scale;

      return {
        scale: newScale,
        panX: mouseX - (mouseX - prev.panX) * ratio,
        panY: mouseY - (mouseY - prev.panY) * ratio,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // ==========================================================
  // Drag
  // ==========================================================

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      setIsDragging(true);
      dragMovedRef.current = false;
      dragStartRef.current = {
        x: e.clientX - transform.panX,
        y: e.clientY - transform.panY,
      };
    },
    [transform.panX, transform.panY],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (!isDragging) {
        return;
      }

      const newPanX = e.clientX - dragStartRef.current.x;
      const newPanY = e.clientY - dragStartRef.current.y;

      if (
        Math.abs(newPanX - transform.panX) > 2 ||
        Math.abs(newPanY - transform.panY) > 2
      ) {
        dragMovedRef.current = true;
      }

      setTransform((prev) => ({
        ...prev,
        panX: newPanX,
        panY: newPanY,
      }));
    },
    [isDragging, transform.panX, transform.panY],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // ==========================================================
  // Zoom Buttons
  // ==========================================================

  const zoomIn = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, MAX_ZOOM),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(prev.scale / 1.2, MIN_ZOOM),
    }));
  }, []);

  const resetTransform = useCallback(() => {
    setTransform({ scale: 1, panX: 0, panY: 0 });
  }, []);

  // ==========================================================
  // Canvas Click
  // ==========================================================

  const handleCanvasClick = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      if (dragMovedRef.current) {
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const { width, height } = canvasSizeRef.current;
      const map = computeMapArea(width, height);

      for (const robot of robotData) {
        const { x, y } = worldToCanvas(robot.x, robot.y, map, transform);
        const size = ROBOT_ICON_SIZE * Math.max(0.7, Math.min(transform.scale, 1.5));
        const half = size / 2;

        if (
          mouseX >= x - half &&
          mouseX <= x + half &&
          mouseY >= y - half &&
          mouseY <= y + half
        ) {
          setSelectedInfo({ type: 'robot', data: robot });
          return;
        }
      }

      for (const node of nodes) {
        const { x, y } = worldToCanvas(node.x, node.y, map, transform);
        const radius = (NODE_ICON_SIZE / 2) * Math.max(0.7, Math.min(transform.scale, 1.5));
        const dx = mouseX - x;
        const dy = mouseY - y;

        if (dx * dx + dy * dy <= radius * radius) {
          setSelectedInfo({ type: 'node', data: node });
          return;
        }
      }
    },
    [robotData, nodes, transform],
  );

  // ==========================================================
  // Render
  // ==========================================================

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

        <ZoomControls
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onReset={resetTransform}
        />

        <MapInfoPanel
          nodeCount={nodes.length}
          robotCount={robotData.length}
        />
      </CanvasContainer>

      <StatusBarView
        loading={loading}
        currentInterval={currentInterval}
        error={error}
      />

      <MapLegend />

      {selectedInfo && (
        <BottomModal
          info={selectedInfo}
          onClose={() => setSelectedInfo(null)}
        />
      )}
    </MapLayout>
  );
}