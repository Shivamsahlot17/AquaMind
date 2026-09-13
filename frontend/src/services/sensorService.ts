import api from "./api";

export interface SensorStation {
  id: string;
  code: string;
  name: string;
}

export interface Sensor {
  id: string;
  deviceId: string;
  deviceKey: string;
  macAddress?: string | null;
  firmwareVersion?: string | null;
  status: "ONLINE" | "OFFLINE" | "MAINTENANCE";
  lastSeen?: string | null;
  createdAt: string;
  updatedAt: string;
  stationId?: string | null;
  station?: SensorStation | null;
}

export interface RegisterSensorData {
  deviceId: string;
  macAddress?: string;
  firmwareVersion?: string;
  stationId: string;
}

export interface UpdateSensorData {
  macAddress?: string;
  firmwareVersion?: string;
  stationId?: string;
  status?: "ONLINE" | "OFFLINE" | "MAINTENANCE";
}

export async function getSensors(): Promise<Sensor[]> {
  const response = await api.get("/sensors");

  return response.data.sensors;
}

export async function getSensorById(
  sensorId: string
): Promise<Sensor> {
  const response = await api.get(`/sensors/${sensorId}`);

  return response.data.sensor;
}

export async function registerSensor(
  data: RegisterSensorData
): Promise<Sensor> {
  const response = await api.post("/sensors/register", data);

  return response.data.sensor;
}

export async function updateSensor(
  sensorId: string,
  data: UpdateSensorData
): Promise<Sensor> {
  const response = await api.patch(
    `/sensors/${sensorId}`,
    data
  );

  return response.data.sensor;
}

export async function deleteSensor(
  sensorId: string
): Promise<void> {
  await api.delete(`/sensors/${sensorId}`);
}