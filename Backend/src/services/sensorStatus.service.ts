import prisma from "../config/prisma";

export async function updateOfflineSensors() {
  try {
    const timeout = new Date(Date.now() - 30 * 1000);

    const result = await prisma.sensor.updateMany({
      where: {
        status: "ONLINE",
        OR: [
          {
            lastSeen: {
              lt: timeout,
            },
          },
          {
            lastSeen: null,
          },
        ],
      },
      data: {
        status: "OFFLINE",
      },
    });

    if (result.count > 0) {
      console.log(
        `${result.count} sensor(s) marked OFFLINE`
      );
    }
  } catch (error) {
    console.error(
      "Failed to update sensor status:",
      error
    );
  }
}