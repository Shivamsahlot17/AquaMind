import { Request, Response } from "express";
import prisma from "../services/prisma";

// GET /api/stations
export const getStations = async (
  req: Request,
  res: Response
) => {
  try {
    const stations = await prisma.station.findMany();

    res.status(200).json(stations);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch stations",
    });
  }
};

// POST /api/stations
export const createStation = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      code,
      name,
      location,
      latitude,
      longitude,
    } = req.body;

    const station = await prisma.station.create({
      data: {
        code,
        name,
        location,
        latitude,
        longitude,
      },
    });

    res.status(201).json(station);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create station",
    });
  }
};