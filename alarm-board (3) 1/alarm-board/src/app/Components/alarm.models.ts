export interface Machine {
  id: number;
  name?: string;
  location?: string;
}

export interface Alarm {
  id: number;
  code: string;
  message: string;
  severity: string;
}

export interface EventRecord {
  id: number;
  machine: Machine;
  alarm: Alarm;
  ts: string;
  state: string; 
}

export interface Summary {
  active: number;
  acknowledged: number;
  cleared: number;
  total: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}