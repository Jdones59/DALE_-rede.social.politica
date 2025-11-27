import { Router } from "express";
import AuthController from "./auth.controller";
import { authMiddleware } from "../../utils/authMiddleware";

const router = Router();
const controller = new AuthController();

// registro e login
router.post("/register", (req, res) => controller.register(req, res));
router.post("/login", (req, res) => controller.login(req, res));

// rota protegida para recuperar dados do token
router.get("/me", authMiddleware, (req, res) => controller.me(req, res));

export default router;
