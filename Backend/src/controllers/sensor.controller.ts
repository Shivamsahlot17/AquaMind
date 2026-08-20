import { Request, Response } from "express";
import crypto from "crypto";

import prisma from "../config/prisma";

export const registerSensor = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      deviceId,
      macAddress,
      firmwareVersion,
      stationId,
    } = req.body;

    if (!deviceId || !stationId) {
      return res.status(400).json({
        success: false,
        message: "Device ID and Station ID are required.",
      });
    }

    const existingSensor = await prisma.sensor.findUnique({
      where: {
        deviceId,
      },
    });

    if (existingSensor) {
      return res.status(409).json({
        success: false,
        message: "Device ID already exists.",
      });
    }

    const station = await prisma.station.findUnique({
      where: {
        id: stationId,
      },
    });

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Station not found.",
      });
    }

    const deviceKey = crypto.randomBytes(32).toString("hex");

    const sensor = await prisma.sensor.create({
      data: {
        deviceId,
        deviceKey,
        macAddress,
        firmwareVersion,
        stationId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Sensor registered successfully.",
      sensor,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getSensors = async (
  req: Request,
  res: Response
) => {
  try {
    const sensors = await prisma.sensor.findMany({
      include: {
        station: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      sensors,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sensors.",
    });
  }
};
export const getSensorById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const sensor = await prisma.sensor.findUnique({
      where: {
        id,
      },
      include: {
        station: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: "Sensor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      sensor,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sensor.",
    });
  }
};
export const updateSensor = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const {
      macAddress,
      firmwareVersion,
      stationId,
      status,
    } = req.body;

    const existingSensor = await prisma.sensor.findUnique({
      where: {
        id,
      },
    });

    if (!existingSensor) {
      return res.status(404).json({
        success: false,
        message: "Sensor not found.",
      });
    }

    if (stationId) {
      const station = await prisma.station.findUnique({
        where: {
          id: stationId,
        },
      });

      if (!station) {
        return res.status(404).json({
          success: false,
          message: "Station not found.",
        });
      }
    }

    const sensor = await prisma.sensor.update({
      where: {
        id,
      },
      data: {
        ...(macAddress !== undefined && { macAddress }),
        ...(firmwareVersion !== undefined && {
          firmwareVersion,
        }),
        ...(stationId !== undefined && {
          stationId,
        }),
        ...(status !== undefined && {
          status,
        }),
      },
      include: {
        station: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Sensor updated successfully.",
      sensor,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update sensor.",
    });
  }
};
export const deleteSensor = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;

    const sensor = await prisma.sensor.findUnique({
      where: {
        id,
      },
    });

    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: "Sensor not found.",
      });
    }

    await prisma.sensor.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Sensor deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete sensor.",
    });
  }
};