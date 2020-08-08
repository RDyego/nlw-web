import { Request, Response } from 'express';
import db from "../database/connection";
import convertHourToMinutes from "../utils/convertHourToMinutes";

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

export default class ClassesController {
    async create(req: Request, res: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = req.body;

        const trx = await db.transaction();

        try {
            const insertedUsersIds = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio,
            });

            const user_id = insertedUsersIds[0];

            const insertedClassesIds = await trx('classes').insert({
                subject,
                cost,
                user_id
            });

            const class_id = insertedClassesIds[0];

            const classSchedule = schedule.map((s: ScheduleItem) => {
                return {
                    week_day: s.week_day,
                    from: convertHourToMinutes(s.from),
                    to: convertHourToMinutes(s.to),
                    class_id
                };
            });

            await trx('classe_schedule').insert(classSchedule);

            await trx.commit();

            return res.status(201).send();
        } catch (error) {
            await trx.rollback();
            return res.status(400).json({
                error
            });
        }

    }
}