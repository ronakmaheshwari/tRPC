import express from "express"
import zod from "zod"
import {todoModal} from "../db"
import { authMiddleware } from "../middleware"

const todoRouter = express.Router()

const TodoSchema = zod.object({
    title:zod.string(),
    description:zod.string()
})

const UpdateSchema = zod.object({
    id:zod.string(),
    title:zod.string(),
    description:zod.string()
})

const PatchSchema = zod.object({
    id:zod.string(),
    title:zod.string().optional(),
    description: zod.string().optional()
})

const DeleteSchema = zod.object({
    id:zod.string()
})

type TodoType = zod.infer<typeof TodoSchema>;
type UpdateType = zod.infer<typeof UpdateSchema>;
type PatchType= zod.infer<typeof PatchSchema>;

todoRouter.get('/',authMiddleware,async(req:any,res:any)=>{
    try{
        const userId = req.userId;
        const response = await todoModal.find({userId});
        return res.status(200).json({
            todos: response.map((x) =>({
                title: x.title,
                description: x.description
            }))
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch todos" });
    }
})

todoRouter.post('/add',authMiddleware,async(req:any,res:any)=>{
   try{
    const {success} = TodoSchema.safeParse(req.body);
        if(!success){
            return res.status(500).json({
                message:"Wrong Inputs Were Provided"
            })
        }
        const id = req.userId;
        const {title,description} = req.body;
        const response = await todoModal.create({userId:id,title,description})
        if(!response){
            return res.status(500).json({
                message:"Internal Error Occured"
            })
        }
    return res.status(200).json({
        message:"Todo was successfully Added!"
    })
   }catch(error){
        console.log(error)
        return res.status(500).json({
            message:"Internal Error Occured"
        })
   }
})

todoRouter.put('/update',authMiddleware,async(req:any,res:any)=>{
    try{
    const {success} = UpdateSchema.safeParse(req.body);
        if(!success){
            return res.status(404).json({
                message:"Wrong Inputs Were Provided"
            })
        }
        const userId = req.userId;
        console.log(userId)
        const {id,title,description} = req.body;
        const CheckId = await todoModal.findById(id)
        if(!CheckId){
            return res.status(404).json({
                message:"Id doesnt Exist!"
            })
        }
        const response = await todoModal.findByIdAndUpdate({id,title,description});
        return res.status(200).json({
            message:"The Todo Is updated"
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:"Internal Error Occured"
        })
    }
})

todoRouter.patch('/update',authMiddleware,async(req:any,res:any)=>{
    try{
        const {success} = PatchSchema.safeParse(req.body)
        if(!success){
            return res.status(400).json({
                message:"Wrong Inputs Were Provided"
            })
        }
        const { id, title, description } = req.body
        const todo = await todoModal.findById(id);
        if (!todo) {
        return res.status(404).json({ message: "Todo not found!" });
        }

    await todoModal.findByIdAndUpdate(id, { ...(title && { title }), ...(description && { description }) });
    return res.status(200).json({ message: "Todo patched successfully" });
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:"Internal Error Occured"
        })
    }
})

todoRouter.delete('/delete',authMiddleware,async(req:any,res:any)=>{
    try {
    const {success} = DeleteSchema.safeParse(req.body);
        if(!success){
            return res.status(400).json({
                message:"Wrong Inputs Were Provided"
            })
        }
    const id = req.body.id;
    const CheckId = await todoModal.findById(id)
        if(!CheckId){
            return res.status(400).json({
                message:"Id provided Was invalid"
            })
        }
    await todoModal.findByIdAndDelete(id)
    return res.status(200).json({
        message:"Todo Deleted Successfully!"
    })
    } catch (error) {
          console.log(error)
        return res.status(500).json({
            message:"Internal Error Occured"
        })
    }
})

export default todoRouter