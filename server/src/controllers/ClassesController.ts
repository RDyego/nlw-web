import { Request, Response } from 'express';
import db from "../database/connection";
import convertHourToMinutes from "../utils/convertHourToMinutes";

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

export default class ClassesController {
    async index(req: Request, res: Response) {
        const f = {
            week_day: Number(req.query.week_day),
            subject: req.query.subject as string,
            time: req.query.time as string
        };

        if (!f.week_day || !f.subject || !f.time) {
            return res.status(400).json({ error: 'Missing filters to search classes.' });
        }

        const timeInMinutes = convertHourToMinutes(f.time);

        const classes = await db('classes')
            .whereExists(function () {
                this.select('classe_schedule.*')
                    .from('classe_schedule')
                    .whereRaw('`classe_schedule`.`class_id` = `classes`.`id`')
                    .whereRaw('`classe_schedule`.`week_day` = ??', [f.week_day])
                    .whereRaw('`classe_schedule`.`from` <= ??', [timeInMinutes])
                    .whereRaw('`classe_schedule`.`to` > ??', [timeInMinutes])
            })
            .where('classes.subject', '=', f.subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*']);

        return res.send(classes);
    }

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