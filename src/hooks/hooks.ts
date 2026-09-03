import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { fetchMapDetails, fetchRobotStatus } from '../api/Info';
import type { RobotStatus } from '../types/device';
import type { MapPointInfo, MapLineInfo } from '../types/node';

import { IDLE_POLL_INTERVAL, ERROR_POLL_INTERVAL } from '../libs/constants';
import type { MapIconName, MapIcons } from '../types/map';

export function useMapData() {
  const [nodes, setNodes] = useState<MapPointInfo[]>([]);
  const [edges, setEdges] = useState<MapLineInfo[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadMap = async () => {
      try {
        const data = await fetchMapDetails();
        if (cancelled) {
          return;
        }

        setNodes(data?.points ?? []);
        setEdges(data?.lines ?? []);
      } catch (err) {
        console.error('지도 로드 실패:', err);
      }
    };

    loadMap();

    return () => {
      cancelled = true;
    };
  }, []);

  const nodeMap = useMemo(() => {
    const map = new Map<string, MapPointInfo>();
    for (const node of nodes) {
      map.set(node.dataCode, node);
    }
    return map;
  }, [nodes]);

  return { nodes, edges, nodeMap };
}

export function useMapImage(onLoaded: () => void) {
  const mapImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      mapImageRef.current = img;
      requestAnimationFrame(() => onLoaded());
    };

    img.onerror = () => {
      console.error('map.svg 로드 실패. public/map.svg 위치를 확인하세요.');
    };

    img.src = '/map.svg';

    return () => {
      img.onload = null;
      img.onerror = null;
      mapImageRef.current = null;
    };
  }, [onLoaded]);

  return { mapImageRef };
}

export function useRobotPolling() {
  const [robotData, setRobotData] = useState<RobotStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentInterval, setCurrentInterval] = useState(IDLE_POLL_INTERVAL);

  const mountedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollingRef = useRef(false);

  const fetchStatusAndGetNextInterval = useCallback(
    async (isInitial = false): Promise<number> => {
      if (isInitial) {
        setLoading(true);
      }

      try {
        const data = await fetchRobotStatus();

        if (!mountedRef.current) {
          return IDLE_POLL_INTERVAL;
        }

        setRobotData(data ?? []);
        setError(null);

        return IDLE_POLL_INTERVAL;
      } catch (err) {
        console.error('Robot status polling error:', err);

        if (isInitial && mountedRef.current) {
          setError('로봇 서버에 연결할 수 없습니다.');
        }

        return ERROR_POLL_INTERVAL;
      } finally {
        if (isInitial && mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    mountedRef.current = true;

    const runPolling = async (isInitial = false) => {
      if (pollingRef.current) {
        return;
      }

      pollingRef.current = true;

      try {
        const nextInterval = await fetchStatusAndGetNextInterval(isInitial);

        if (!mountedRef.current) {
          return;
        }

        setCurrentInterval(nextInterval);

        timerRef.current = setTimeout(() => {
          pollingRef.current = false;
          runPolling(false);
        }, nextInterval);
      } catch {
        pollingRef.current = false;

        if (mountedRef.current) {
          timerRef.current = setTimeout(
            () => runPolling(false),
            ERROR_POLL_INTERVAL,
          );
        }
      }
    };

    runPolling(true);

    return () => {
      mountedRef.current = false;
      pollingRef.current = false;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [fetchStatusAndGetNextInterval]);

  return { robotData, loading, error, currentInterval };
}

const ICON_SOURCES: Record<MapIconName, string> = {
  node: '/node.svg',
  tusk: '/tusk.svg',
  charger: '/charger.svg',
};

export function useMapIcons(onLoaded: () => void) {
  const iconsRef = useRef<MapIcons>({ node: null, tusk: null, charger: null });

  useEffect(() => {
    const images: HTMLImageElement[] = [];

    (Object.entries(ICON_SOURCES) as [MapIconName, string][]).forEach(
      ([name, src]) => {
        const img = new Image();

        img.onload = () => {
          iconsRef.current[name] = img;
          requestAnimationFrame(() => onLoaded());
        };

        img.onerror = () => {
          console.error(`${src} 로드 실패 — public 디렉토리를 확인하세요.`);
        };

        img.src = src;
        images.push(img);
      },
    );

    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });

      iconsRef.current = { node: null, tusk: null, charger: null };
    };
  }, [onLoaded]);

  return { iconsRef };
}