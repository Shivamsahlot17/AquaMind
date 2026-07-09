import { Request, Response } from "express";
import prisma from "../services/prisma";

export const getStations = async (
    req: Request,
    res: Response
) => {

    const stations = await prisma.station.findMany();

    res.json(stations);

};