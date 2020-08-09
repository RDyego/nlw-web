import { Request, Response } from 'express';
import db from "../database/connection";
import convertHourToMinutes from "../utils/convertHourToMinutes";

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

export default class ConnectionsController {
    async index(req: Request, res: Response) {
        const totalConnections = await db('connections').count('* as total');
        return res.send( totalConnections[0]);
    }

    async create(req: Request, res: Response) {
        const { user_id } = req.body;

        try {
            const insertedUsersIds = await db('connections').insert({
                user_id
            });
            return res.status(201).send();
        } catch (error) {
            return res.status(400).json({
                error
            });
        }

    }
}