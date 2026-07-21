export interface Station {
  id: string;
  name: string;
  code: string;
}

export interface Reading {
  id: string;
  depth: number;
  temperature: number;
  ph: number;
  tds: number;
  waterQuality: string;
  createdAt: string;
  station: Station;
}