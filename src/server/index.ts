import todoModal from "../db"
import {publicProcedure, router} from "./trpc"
import zod from "zod";

const TodoSchema = zod.object({
    title:zod.string(),
    description:zod.string()
})

const appRouter=router({
    GetTodo:publicProcedure
    .query(async()=>{
        const todos = await todoModal.find()
        return todos
    }),
    
    CreateTodo:publicProcedure
    .input(TodoSchema)
    .mutation(async(opts)=>{
        const {input} = opts
        const title = input.title;
        const description = input.description;
        const response = await todoModal.create({title,description})
        return response
    })
})

export type AppRouter = typeof appRouter;
