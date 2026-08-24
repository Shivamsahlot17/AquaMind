import api from "./api";

export async function getAlerts() {
  const response = await api.get("/readings/alerts");
  return response.data;
}