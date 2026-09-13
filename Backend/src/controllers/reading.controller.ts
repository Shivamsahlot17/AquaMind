import { Request, Response } from "express";
import prisma from "../services/prisma";
import {
  AlertSeverity,
  SensorStatus,
} from "@prisma/client";

function calculateWaterQuality(ph: number, tds: number) {
  if (ph >= 6.5 && ph <= 8.5 && tds <= 300)
    return "EXCELLENT";

  if (ph >= 6.5 && ph <= 8.5 && tds <= 500)
    return "GOOD";

  if (tds <= 900)
    return "FAIR";

  if (tds <= 1200)
    return "POOR";

  return "UNSAFE";
}

async function createAlerts(
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
    });
  }

  if (ph < 6.5 || ph > 8.5) {
    alerts.push({
      title: "Unsafe pH Level",
      message: `Current pH is ${ph}.`,
      severity: AlertSeverity.MEDIUM,
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
    });
  }

  if (alerts.length > 0) {
    await prisma.groundwaterAlert.createMany({
      data: alerts.map((alert) => ({
        ...alert,
        stationId,
      })),
    });
  }
}

export const createReading = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      stationCode,
      depth,
      temperature,
      ph,
      tds,
    } = req.body;

    const deviceId = req.headers["x-device-id"] as string;
    const deviceKey = req.headers["x-device-key"] as string;

    if (!deviceId || !deviceKey) {
      return res.status(401).json({
        success: false,
        message: "Device credentials are required.",
      });
    }

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

    const sensor = await prisma.sensor.findFirst({
      where: {
        deviceId,
        deviceKey,
      },
      include: {
        station: true,
      },
    });

    if (!sensor) {
      return res.status(401).json({
        success: false,
        message: "Invalid sensor credentials.",
      });
    }

    if (!sensor.station) {
      return res.status(400).json({
        success: false,
        message: "Sensor is not linked to a station.",
      });
    }

    if (sensor.station.code !== stationCode) {
      return res.status(400).json({
        success: false,
        message: "Sensor is not assigned to this station.",
      });
    }

    await prisma.sensor.update({
      where: {
        id: sensor.id,
      },
      data: {
        status: SensorStatus.ONLINE,
        lastSeen: new Date(),
      },
    });

    const quality = calculateWaterQuality(ph, tds);

    const reading = await prisma.groundwaterReading.create({
      data: {
        stationId: sensor.station.id,
        depth,
        temperature,
        ph,
        tds,
        waterQuality: quality,
      },
    });

    await createAlerts(
      sensor.station.id,
      depth,
      ph,
      tds
    );

    return res.status(201).json({
      success: true,
      message: "Reading received successfully.",
      reading,
      station: sensor.station.code,
    });
  } catch (error) {
    console.error("Create reading error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getLatestReading = async (
  req: Request,
  res: Response
) => {
  try {
    const reading = await prisma.groundwaterReading.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        station: true,
      },
    });

    return res.json(reading);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch latest reading",
    });
  }
};

export const getRecentReadings = async (
  req: Request,
  res: Response
) => {
  try {
    const readings = await prisma.groundwaterReading.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      include: {
        station: true,
      },
    });

    return res.json(readings.reverse());
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch readings",
    });
  }
};

export const getAlerts = async (
  req: Request,
  res: Response
) => {
  try {
    const alerts = await prisma.groundwaterAlert.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      include: {
        station: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    });

    return res.json(alerts);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch alerts",
    });
  }
};