import { Router } from "express";
import { authUser } from "../controller/authController";

const router = Router();

router.get("/auth", authUser);

export default router;
