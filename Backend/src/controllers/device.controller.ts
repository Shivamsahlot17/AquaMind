import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AlertSeverity } from "@prisma/client";

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

export const uploadReading = async (
  req: Request,
  res: Response
) => {
  try {
    const sensor = req.sensor;

    const {
      depth,
      temperature,
      ph,
      tds,
    } = req.body;

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

    if (!sensor.stationId) {
      return res.status(400).json({
        success: false,
        message: "Sensor is not assigned to any station.",
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

    const reading =
      await prisma.groundwaterReading.create({
        data: {
          stationId: sensor.stationId,
          depth,
          temperature,
          ph,
          tds,
          waterQuality: quality,
        },
      });

    await createAlerts(
      sensor.stationId,
      depth,
      ph,
      tds
    );

    return res.status(201).json({
      success: true,
      message: "Reading uploaded successfully.",
      reading,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload reading.",
    });
  }
};