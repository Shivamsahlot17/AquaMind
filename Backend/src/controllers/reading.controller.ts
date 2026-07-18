import { Request, Response } from "express";
import prisma from "../services/prisma";

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