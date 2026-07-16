import prisma from "../services/prisma";

function random(min: number, max: number) {
    return Number((Math.random() * (max - min) + min).toFixed(2));
}

function waterQuality(ph: number, tds: number) {

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

export async function startSensorSimulator() {

    setInterval(async () => {

        const station = await prisma.station.findFirst();

        if (!station) return;

        const depth = random(15, 25);
        const temperature = random(22, 32);
        const ph = random(6.5, 8.5);
        const tds = random(250, 700);

        const quality = waterQuality(ph, tds);

        await prisma.groundwaterReading.create({

            data: {

                stationId: station.id,

                depth,

                temperature,

                ph,

                tds,

                waterQuality: quality

            }

        });

        console.log("New Reading Saved");

    }, 5000);

}