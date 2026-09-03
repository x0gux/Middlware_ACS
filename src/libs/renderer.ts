import type { RobotStatus } from '../types/device';
import type { MapPointInfo, MapLineInfo } from '../types/node';

import type { Transform, MapIcons } from '../types/map';
import { nodeColor, NODE_ICON_SIZE, ROBOT_ICON_SIZE } from './constants';
import { worldToCanvas } from './mapGeometry';
import type { MapArea } from './mapGeometry';

type NodeMap = Map<string, MapPointInfo>;

export interface RenderSceneOptions {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
  mapImage: HTMLImageElement | null;
  icons: MapIcons;
  edges: MapLineInfo[];
  nodes: MapPointInfo[];
  nodeMap: NodeMap;
  robots: RobotStatus[];
  map: MapArea;
  transform: Transform;
}

function drawMapImage(
  ctx: CanvasRenderingContext2D,
  mapImage: HTMLImageElement | null,
  map: MapArea,
  transform: Transform,
) {
  if (!mapImage) {
    return;
  }

  const centerX = map.x + map.width / 2;
  const centerY = map.y + map.height / 2;

  ctx.save();

  ctx.translate(
    centerX + transform.panX,
    centerY + transform.panY,
  );
  ctx.scale(transform.scale, transform.scale);
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(mapImage, map.x, map.y, map.width, map.height);

  ctx.restore();
}

function drawEdges(
  ctx: CanvasRenderingContext2D,
  edges: MapLineInfo[],
  nodeMap: NodeMap,
  map: MapArea,
  transform: Transform,
) {
  edges.forEach((edge) => {
    const start = nodeMap.get(edge.nodeStart);
    const end = nodeMap.get(edge.nodeEnd);
    if (!start || !end) {
      return;
    }

    const sp = worldToCanvas(start.x, start.y, map, transform);
    const ep = worldToCanvas(end.x, end.y, map, transform);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(sp.x, sp.y);
    ctx.lineTo(ep.x, ep.y);
    ctx.strokeStyle = '#e8edf2';
    ctx.lineWidth = Math.max(2, 3 * transform.scale);
    ctx.lineCap = 'round';
    ctx.setLineDash([]);
    ctx.stroke();
    ctx.restore();
  });
}

function drawNodeMark(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dataType: string,
  size: number,
  icons: MapIcons,
) {
  const icon = dataType === 'ChargingPoint' ? icons.charger : icons.node;

  if (icon) {
    ctx.drawImage(icon, x - size / 2, y - size / 2, size, size);
    return;
  }

  const radius = size / 2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = nodeColor(dataType);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawNodes(
  ctx: CanvasRenderingContext2D,
  nodes: MapPointInfo[],
  map: MapArea,
  transform: Transform,
  icons: MapIcons,
) {
  nodes.forEach((node, index) => {
    const { x, y } = worldToCanvas(node.x, node.y, map, transform);
    const size = NODE_ICON_SIZE * Math.max(0.7, Math.min(transform.scale, 1.5));

    ctx.save();

    drawNodeMark(ctx, x, y, node.dataType, size, icons);

    const fontSize = Math.max(10, 12 * Math.min(transform.scale, 1.4));

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`N${index + 1}`, x + size / 2 + 6, y);

    ctx.fillStyle = '#b8b8b8';
    ctx.font = `${Math.max(8, 9 * Math.min(transform.scale, 1.3))}px Arial`;
    ctx.fillText(node.dataCode, x + size / 2 + 6, y + fontSize);

    ctx.restore();
  });
}

function drawRobotMark(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  icons: MapIcons,
) {
  if (icons.tusk) {
    ctx.drawImage(icons.tusk, x - size / 2, y - size / 2, size, size);
    return;
  }

  const half = size / 2;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.75, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fill();

  ctx.fillStyle = '#ffcc00';
  ctx.fillRect(x - half, y - half, size, size);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(x - half, y - half, size, size);
}

function drawRobots(
  ctx: CanvasRenderingContext2D,
  robots: RobotStatus[],
  map: MapArea,
  transform: Transform,
  icons: MapIcons,
) {
  robots.forEach((robot) => {
    const { x, y } = worldToCanvas(robot.x, robot.y, map, transform);
    const size = ROBOT_ICON_SIZE * Math.max(0.7, Math.min(transform.scale, 1.5));

    ctx.save();

    drawRobotMark(ctx, x, y, size, icons);

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(10, 12 * Math.min(transform.scale, 1.5))}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(String(robot.id), x, y - size / 2 - 5);

    ctx.restore();
  });
}

export function renderScene(options: RenderSceneOptions): void {
  const {
    ctx,
    width,
    height,
    dpr,
    mapImage,
    icons,
    edges,
    nodes,
    nodeMap,
    robots,
    map,
    transform,
  } = options;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, width, height);

  drawMapImage(ctx, mapImage, map, transform);
  drawEdges(ctx, edges, nodeMap, map, transform);
  drawNodes(ctx, nodes, map, transform, icons);
  drawRobots(ctx, robots, map, transform, icons);
}