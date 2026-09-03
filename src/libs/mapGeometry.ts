import { MAP_SVG, WORLD_BOUNDS, NODE_AREA } from './constants';
import type { Transform } from '../types/map';

export type MapArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function computeMapArea(width: number, height: number): MapArea {
  if (width <= 0 || height <= 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const svgRatio = MAP_SVG.width / MAP_SVG.height;

  let mapWidth = width * 0.9;
  let mapHeight = mapWidth / svgRatio;

  if (mapHeight > height * 0.78) {
    mapHeight = height * 0.78;
    mapWidth = mapHeight * svgRatio;
  }

  return {
    x: (width - mapWidth) / 2,
    y: (height - mapHeight) / 2,
    width: mapWidth,
    height: mapHeight,
  };
}

export function worldToMap(
  x: number,
  y: number,
  map: MapArea,
): { x: number; y: number } {
  const nx = Math.max(
    0,
    Math.min(
      1,
      (x - WORLD_BOUNDS.minX) /
      (WORLD_BOUNDS.maxX - WORLD_BOUNDS.minX),
    ),
  );

  const ny = Math.max(
    0,
    Math.min(
      1,
      (y - WORLD_BOUNDS.minY) /
      (WORLD_BOUNDS.maxY - WORLD_BOUNDS.minY),
    ),
  );

  const nodeLeft = map.x + map.width * NODE_AREA.left;
  const nodeRight = map.x + map.width * NODE_AREA.right;
  const nodeTop = map.y + map.height * NODE_AREA.top;
  const nodeBottom = map.y + map.height * NODE_AREA.bottom;

  return {
    x: nodeLeft + nx * (nodeRight - nodeLeft),
    y: nodeBottom - ny * (nodeBottom - nodeTop),
  };
}

export function worldToCanvas(
  x: number,
  y: number,
  map: MapArea,
  transform: Transform,
): { x: number; y: number } {
  const centerX = map.x + map.width / 2;
  const centerY = map.y + map.height / 2;
  const point = worldToMap(x, y, map);

  return {
    x: centerX + (point.x - centerX) * transform.scale + transform.panX,
    y: centerY + (point.y - centerY) * transform.scale + transform.panY,
  };
}