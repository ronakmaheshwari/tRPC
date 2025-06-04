import express from "express"
import zod from "zod"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { userModal } from "../db"
import { authMiddleware } from "../middleware"

const saltround = 10
const jwtSecret = "123456"
const userRouter = express.Router();

const SignupSchema = zod.object({
    username:zod.string().min(4).max(20),
    password:zod.string().min(5).max(50)
})

type SignupType = zod.infer<typeof SignupSchema>

userRouter.post('/signup',async(req:any,res:any)=>{
    try {
    const {success} = SignupSchema.safeParse(req.body)
    if(!success){
        return res.status(404).json({
            message:"Wrong Inputs were Provided"
        })
    }
    const {username,password} = req.body
    const Checkusername = await userModal.findOne({ username })
    if(Checkusername){
        return res.status(400).json({
            message:"Username Already Exists"
        })
    }
    const hashedpass = await bcrypt.hash(password,saltround);
    const response = await userModal.create({username,password:hashedpass})
    const token = jwt.sign({userId:response._id},jwtSecret);
    return res.status(200).json({
        token:token
    })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Internal Error Occured"
        })
    }
})

userRouter.post("/signin",async(req:any,res:any)=>{
    try {
    const {success} = SignupSchema.safeParse(req.body)
    if(!success){
        return res.status(400).json({
            message:"Wrong Inputs were provided"
        })
    }
    const {username,password} = req.body
    const Checkusername = await userModal.findOne({username})
    if(!Checkusername){
        return res.status(404).json({
            message:"Username Doesnt Exist"
        })
    }
    const Checkpassword = await bcrypt.compare(password,Checkusername.password)
    if(!Checkpassword){
        return res.status(404).json({
            message:"Wrong Password Provided"
        })
    }
    const token = await jwt.sign({userId:Checkusername._id},jwtSecret)
    return res.status(200).json({
        token: token
    })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Internal Error Occured"
        })
    }
})

userRouter.get("/",authMiddleware,async(req:any,res:any)=>{
    const response = await userModal.find();
    return res.status(200).json({
        message:response.map((x)=>{
            return{
                username:x.username,
                password:x.password
            }
        })
    })
})

export default userRouter