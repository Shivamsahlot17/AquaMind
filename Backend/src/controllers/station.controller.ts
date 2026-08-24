import { Request, Response } from "express";
import prisma from "../services/prisma";

// GET /api/stations
export const getStations = async (
  req: Request,
  res: Response
) => {
  try {
    const stations = await prisma.station.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(stations);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch stations",
    });
  }
};

// GET /api/stations/:code
export const getStationByCode = async (
  req: Request,
  res: Response
) => {
  try {
    const code = req.params.code as string;

    const station = await prisma.station.findUnique({
      where: {
        code,
      },
      include: {
        sensors: true,
      },
    });

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Station not found",
      });
    }

    return res.status(200).json({
      success: true,
      station,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch station",
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

    if (
      !code ||
      !name ||
      !location ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All station fields are required.",
      });
    }

    const existingStation = await prisma.station.findUnique({
      where: {
        code,
      },
    });

    if (existingStation) {
      return res.status(409).json({
        success: false,
        message: "Station code already exists.",
      });
    }

    const station = await prisma.station.create({
      data: {
        code,
        name,
        location,
        latitude,
        longitude,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Station created successfully.",
      station,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create station",
    });
  }
};

// PATCH /api/stations/:id
export const updateStation = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const {
      name,
      location,
      latitude,
      longitude,
      status,
    } = req.body;

    const existingStation = await prisma.station.findUnique({
      where: {
        id,
      },
    });

    if (!existingStation) {
      return res.status(404).json({
        success: false,
        message: "Station not found",
      });
    }

    const station = await prisma.station.update({
      where: {
        id,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(location !== undefined && { location }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(status !== undefined && { status }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Station updated successfully.",
      station,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update station",
    });
  }
};