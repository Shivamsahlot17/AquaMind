import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

export const authenticateSensor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deviceId = req.headers["x-device-id"] as string;
    const deviceKey = req.headers["x-device-key"] as string;

    if (!deviceId || !deviceKey) {
      return res.status(401).json({
        success: false,
        message: "Sensor credentials are required.",
      });
    }

    const sensor = await prisma.sensor.findUnique({
      where: {
        deviceId,
      },
    });

    if (!sensor || sensor.deviceKey !== deviceKey) {
      return res.status(401).json({
        success: false,
        message: "Invalid sensor credentials.",
      });
    }

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Sensor authentication failed.",
    });
  }
};