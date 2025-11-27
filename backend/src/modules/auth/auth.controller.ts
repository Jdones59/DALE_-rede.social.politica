import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const service = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;
            const user = await service.register(name, email, password);
            return res.json(user);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await service.login(email, password);
            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }
}
