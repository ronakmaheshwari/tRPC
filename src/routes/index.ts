import express from "express"
import todoRouter from "./todo"

const router = express.Router()

router.use("/todo",todoRouter)

export default router