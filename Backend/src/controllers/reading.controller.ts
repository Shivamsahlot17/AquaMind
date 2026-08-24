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
// console.log({ stationId, depth, ph, tds });
async function createAlerts(
  stationId: string,
  depth: number,
  ph: number,
  tds: number
) {
  console.log("createAlerts called");
  console.log({ stationId, depth, ph, tds });

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
      severity: tds > 1200
        ? AlertSeverity.HIGH
        : AlertSeverity.MEDIUM,
    });
  }

  console.log("Generated Alerts:", alerts);

  if (alerts.length > 0) {
    await prisma.groundwaterAlert.createMany({
      data: alerts.map((alert) => ({
        ...alert,
        stationId,
      })),
    });

    console.log("Alerts inserted into database");
  } else {
    console.log("No alerts generated");
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
    

    const station = await prisma.station.findUnique({
      where: {
        code: stationCode,
      },
    });

    if (!station) {
      return res.status(404).json({
        message: "Station not found",
      });
    }
    const deviceId = req.headers["x-device-id"] as string;
    await prisma.sensor.update({
      where: {
        deviceId,
      },
      data: {
        status: SensorStatus.ONLINE,
        lastSeen: new Date(),
      },
    });

    const quality = calculateWaterQuality(ph, tds);

    const reading = await prisma.groundwaterReading.create({
      data: {
        stationId: station.id,
        depth,
        temperature,
        ph,
        tds,
        waterQuality: quality,
      },
    });

    await createAlerts(
      station.id,
      depth,
      ph,
      tds
    );

    res.status(201).json(reading);
  } catch (error) {
    console.error(error);

    res.status(500).json({
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

    res.json(reading);
  } catch (error) {
    console.error(error);

    res.status(500).json({
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

    res.json(readings.reverse());
  } catch (error) {
    console.error(error);

    res.status(500).json({
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

    res.json(alerts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch alerts",
    });
  }
};
