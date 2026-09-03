import type { RobotStatus } from './device';
import type { MapPointInfo } from './node';

export type Transform = {
  scale: number;
  panX: number;
  panY: number;
};

export type SelectedInfo =
  | { type: 'robot'; data: RobotStatus }
  | { type: 'node'; data: MapPointInfo }
  | null;

export type MapIconName = 'node' | 'tusk' | 'charger';

export type MapIcons = Record<MapIconName, HTMLImageElement | null>;

export interface StorageInfo {
  name: string;
  carrierId: string | null;
}