import api from "./api";
import type { Reading } from "../types/reading";

export async function getLatestReading(
  stationCode?: string
): Promise<Reading | null> {
  const response = await api.get(
    stationCode
      ? `/readings/latest/${stationCode}`
      : "/readings/latest"
  );

  return response.data;
}

export async function getReadingHistory(
  stationCode?: string
): Promise<Reading[]> {
  const response = await api.get(
    stationCode
      ? `/readings/history/${stationCode}`
      : "/readings/history"
  );

  return response.data;
}

// For Reports page
export async function getRecentReadings(): Promise<Reading[]> {
  const response = await api.get("/readings/history");

  return response.data;
}