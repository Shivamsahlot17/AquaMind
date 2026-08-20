import { Request, Response } from "express";
import prisma from "../config/prisma";
import { SensorStatus, AlertSeverity } from "@prisma/client";

function calculateWaterQuality(ph: number, tds: number) {
  if (ph >= 6.5 && ph <= 8.5 && tds <= 300) {
    return "EXCELLENT";
  }

  if (ph >= 6.5 && ph <= 8.5 && tds <= 500) {
    return "GOOD";
  }

  if (tds <= 900) {
    return "FAIR";
  }

  if (tds <= 1200) {
    return "POOR";
  }

  return "UNSAFE";
}

async function createSensorAlerts(
  stationId: string,
  depth: number,
  ph: number,
  tds: number
) {
  const alerts = [];

  if (depth > 50) {
    alerts.push({
      title: "Critical Groundwater Depth",
      message: `Groundwater depth is ${depth} m.`,
      severity: AlertSeverity.HIGH,
      stationId,
    });
  }

  if (ph < 6.5 || ph > 8.5) {
    alerts.push({
      title: "Unsafe pH Level",
      message: `Current pH is ${ph}.`,
      severity: AlertSeverity.MEDIUM,
      stationId,
    });
  }

  if (tds > 500) {
    alerts.push({
      title: "High TDS",
      message: `TDS reached ${tds} ppm.`,
      severity:
        tds > 1200
          ? AlertSeverity.HIGH
          : AlertSeverity.MEDIUM,
      stationId,
    });
  }

  if (alerts.length > 0) {
    await prisma.groundwaterAlert.createMany({
      data: alerts,
    });
  }
}

export const receiveSensorData = async (
  req: Request,
  res: Response
) => {
  try {
    const deviceId = req.header("x-device-id");
    const deviceKey = req.header("x-device-key");

    const {
      depth,
      temperature,
      ph,
      tds,
    } = req.body;

    // Check device credentials
    if (!deviceId || !deviceKey) {
      return res.status(401).json({
        success: false,
        message: "Device credentials are required.",
      });
    }

    // Check sensor data
    if (
      depth === undefined ||
      temperature === undefined ||
      ph === undefined ||
      tds === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All sensor readings are required.",
      });
    }

    // Find sensor
    const sensor = await prisma.sensor.findFirst({
      where: {
        deviceId,
        deviceKey,
      },
      include: {
        station: true,
      },
    });

    // Sensor doesn't exist
    if (!sensor) {
      return res.status(401).json({
        success: false,
        message: "Invalid sensor credentials.",
      });
    }

    // Sensor is not linked to a station
    if (!sensor.stationId || !sensor.station) {
      return res.status(400).json({
        success: false,
        message: "Sensor is not linked to a station.",
      });
    }

    // Store these after null check
    const stationId = sensor.stationId;
    const station = sensor.station;

    // Calculate water quality
    const quality = calculateWaterQuality(ph, tds);

    // Save reading
    const reading = await prisma.groundwaterReading.create({
      data: {
        stationId,
        depth,
        temperature,
        ph,
        tds,
        waterQuality: quality,
      },
    });

    // Update sensor status
    await prisma.sensor.update({
      where: {
        id: sensor.id,
      },
      data: {
        status: SensorStatus.ONLINE,
        lastSeen: new Date(),
      },
    });

    // Generate alerts
    await createSensorAlerts(
      stationId,
      depth,
      ph,
      tds
    );

    return res.status(201).json({
      success: true,
      message: "Sensor data received successfully.",
      reading,
      station: station.code,
    });

  } catch (error) {
    console.error("Sensor data error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process sensor data.",
    });
  }
};