import prisma from "../config/prisma";
import { SensorStatus } from "@prisma/client";

const OFFLINE_THRESHOLD = 30 * 1000; // 30 seconds

export function startSensorMonitor() {
  console.log("Sensor monitor started.");

  setInterval(async () => {
    try {
      const threshold = new Date(
        Date.now() - OFFLINE_THRESHOLD
      );

      const result = await prisma.sensor.updateMany({
        where: {
          status: SensorStatus.ONLINE,
          OR: [
            {
              lastSeen: null,
            },
            {
              lastSeen: {
                lt: threshold,
              },
            },
          ],
        },
        data: {
          status: SensorStatus.OFFLINE,
        },
      });

      if (result.count > 0) {
        console.log(
          `${result.count} sensor(s) marked OFFLINE.`
        );
      }
    } catch (error) {
      console.error(
        "Sensor monitor error:",
        error
      );
    }
  }, 10000);
}