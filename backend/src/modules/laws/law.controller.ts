// src/modules/laws/law.controller.ts

import { Request, Response } from "express";
import { lawService } from "./law.service";

export class LawController {
    async getAll(req: Request, res: Response) {
        const laws = await lawService.getAll();
        return res.json(laws);
    }

    async getById(req: Request, res: Response) {
        const law = await lawService.getById(req.params.id);
        if (!law) {
            return res.status(404).json({ message: "Lei não encontrada" });
        }
        return res.json(law);
    }

    async create(req: Request, res: Response) {
        const { title, number, year, description, url } = req.body;

        const newLaw = await lawService.create({
            title,
            number,
            year,
            description,
            url,
        });

        return res.status(201).json(newLaw);
    }
}

export const lawController = new LawController();
