import express, { Request, Response } from "express"
import morgan from "morgan"
import zod from "zod"
import todoModal from "./db";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(morgan("dev"))

const TodoSchema = zod.object({
    title:zod.string(),
    description:zod.string()
})

type TodoType = zod.infer<typeof TodoSchema>;

app.get('/todo',async(req:any,res:any)=>{
    try{
        const response = await todoModal.find();
        return res.status(200).json({
            todos:response
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch todos" });
    }
})

app.post('/add',async(req:any,res:any)=>{
   try{
    const {success} = TodoSchema.safeParse(req.body);
        if(!success){
            return res.status(500).json({
                message:"Wrong Inputs Were Provided"
            })
        }
        const {title,description} = req.body;
        const response = await todoModal.create({title,description})
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

app.listen(port,()=>{
    console.log(`App is running on http://localhost:${port}/`);
})