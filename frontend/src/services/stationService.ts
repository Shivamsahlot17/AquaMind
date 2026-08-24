import api from "./api";

export interface Station {
  id: string;
  code: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: string;
}

export async function getStations(): Promise<Station[]> {
  const response = await api.get("/stations");
  return response.data;
}