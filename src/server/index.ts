import todoModal from "../db"
import {publicProcedure, router} from "./trpc"
import zod from "zod";
import { createHTTPServer } from '@trpc/server/adapters/standalone';

const TodoSchema = zod.object({
    title:zod.string(),
    description:zod.string()
})

const UpdateSchema = zod.object({
    id:zod.string(),
    title:zod.string(),
    description:zod.string()
})

const DeleteSchema = zod.object({
    id:zod.string()
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
    }),
    UpdateTodo:publicProcedure
    .input(UpdateSchema)
    .mutation(async(opts)=>{
        const {input} = opts
        const id = input.id
        const title = input.title
        const description = input.description
        const CheckId = await todoModal.findById(id)
        if(!CheckId){
            throw new Error("Invalid ID provided.");
        }
        const response = await todoModal.findByIdAndUpdate(id,{title,description})
        return response
    }),
    DeleteTodo:publicProcedure
    .input(DeleteSchema)
    .mutation(async(opts)=>{
        const id = opts.input.id
        const CheckId = await todoModal.findById(id)
        if(!CheckId){
            throw new Error("Invalid Id Provided")
        }
        const deleted = await todoModal.findByIdAndDelete(id)
        return deleted
    })
})

const server = createHTTPServer({
  router: appRouter,
});
 
server.listen(3001);

export type AppRouter = typeof appRouter;
