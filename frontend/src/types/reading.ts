export interface Station {
  id: string;
  code: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: "ONLINE" | "OFFLINE";
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