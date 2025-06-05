import { publicProcedure, router } from "../trpc";
import { z } from 'zod';
import jwt from "jsonwebtoken";
import { SECRET } from "..";
import { TRPCError } from "@trpc/server";
import { isLoggedIn } from "../middleware/user";

export const userRouter = router({
    signup: publicProcedure
        .output(z.object({
            token: z.string()
        }))
        .input(z.object({
            username: z.string(),
            password: z.string()
        }))
        .mutation(async (opts) => {
            let username = opts.input.username;
            let password = opts.input.password;
            let response = await opts.ctx.db.User.create([{
                username,
                password
            }])
            let userId = response[0]._id;
            const token: string = jwt.sign({ userId: userId }, SECRET, { expiresIn: '1h' });

            return {
                token
            }
        }),
    login: publicProcedure
        .output(z.object({
            token: z.string()
        }))
        .input(z.object({
            username: z.string(),
            password: z.string()
        }))
        .mutation(async (opts) => {
            let response = await opts.ctx.db.User.find({
                email: opts.input.username
            });
            if (!response) {
                throw new TRPCError({ code: 'UNAUTHORIZED' });
            }
            const token: string = jwt.sign({ userId: opts.ctx.userId }, SECRET, { expiresIn: '1h' });

            return {
                token
            }
        }),
    me: publicProcedure
        .use(isLoggedIn)
        .output(z.object({
            email: z.string()
        }))
        .query(async (opts) => {
            const userId = opts.ctx.userId;
            let response = await opts.ctx.db.User.findById(userId);
            if (!response) {
                // shouldn't happen
                throw new TRPCError({ code: 'UNAUTHORIZED' });
            }
            return {
                email: response.username || "",
            }
        }),
});

