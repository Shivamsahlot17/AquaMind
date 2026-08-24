import api from "./api";
import type { Reading } from "../types/reading";

export async function getLatestReading(): Promise<Reading | null> {
  const response = await api.get("/readings/latest");
  return response.data;
}

export async function getReadingHistory(): Promise<Reading[]> {
  const response = await api.get("/readings/history");
  return response.data;
}

// For Reports page
export async function getRecentReadings(): Promise<Reading[]> {
  const response = await api.get("/readings/history");
  return response.data;
}