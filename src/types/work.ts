// 백엔드 ApiResult 응답 구조
export interface ApiResult<T> {
  ok: boolean;
  error?: string | null;
  data?: T | null;
}

// C# TaskDto 대응
export interface TaskDto {
  id: string;
  sequence: number;
  targets: string[];
  priority?: number | null;
  state: string; // e.g. "Created", "Running", "Completed", "Cancelled"
  rawStatus?: string | null;
  lastError?: string | null;
  origin: string;
  createdAt: string;
  updatedAt: string;
}

// C# TaskConfigDto 대응 (미션 섹션용)
export interface TaskConfigDto {
  name?: string | null;
  robotGroup?: string | null;
  containerType?: number | null;
}

// 예약 작업 DTO
export interface ReservationDto {
  id: string;
  taskId?: string;
  scheduledTime: string;
  robotId?: string;
  status: string;
}