import { Request, Response } from "express";
import prisma from "../services/prisma";

export const getLatestReadingByStation = async (
  req: Request,
  res: Response
) => {
  try {
    const code = Array.isArray(req.params.code)
  ? req.params.code[0]
  : req.params.code;

    const station = await prisma.station.findUnique({
      where: {
        code,
      },
    });

    if (!station) {
      return res.status(404).json({
        message: "Station not found",
      });
    }

    const reading = await prisma.groundwaterReading.findFirst({
      where: {
        stationId: station.id,
      },
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

export const getHistoryByStation = async (
  req: Request,
  res: Response
) => {
  try {
    const code = Array.isArray(req.params.code)
  ? req.params.code[0]
  : req.params.code;

    const station = await prisma.station.findUnique({
      where: {
        code,
      },
    });

    if (!station) {
      return res.status(404).json({
        message: "Station not found",
      });
    }

    const readings = await prisma.groundwaterReading.findMany({
      where: {
        stationId: station.id,
      },
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