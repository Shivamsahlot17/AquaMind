import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

declare global {
  namespace Express {
    interface Request {
      sensor?: any;
    }
  }
}

export const authenticateDevice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deviceKey = req.header("x-device-key");

    if (!deviceKey) {
      return res.status(401).json({
        success: false,
        message: "Device key missing.",
      });
    }

    const sensor = await prisma.sensor.findUnique({
      where: {
        deviceKey,
      },
    });

    if (!sensor) {
      return res.status(401).json({
        success: false,
        message: "Invalid device key.",
      });
    }

    req.sensor = sensor;

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Device authentication failed.",
    });
  }
};