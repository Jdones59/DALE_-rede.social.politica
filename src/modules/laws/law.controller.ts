// src/modules/laws/law.controller.ts

import { Request, Response } from "express";
import { lawService } from "./law.service";

export class LawController {
    async getAll(req: Request, res: Response) {
        // Read pagination params from query string (page, perPage or limit)
        const page = req.query.page ? Number(req.query.page) : 1;
        const perPage = req.query.perPage ? Number(req.query.perPage) : req.query.limit ? Number(req.query.limit) : 50;

        const result = await lawService.getAll(page, perPage);

        // Map Prisma Law model to frontend-friendly shape (backwards compatibility)
        const mapped = result.data.map((l: any) => ({
            _id: String(l.id),
            numero: l.number,
            titulo: l.title,
            descricao: l.summary ?? null,
            texto: l.summary ?? null,
            ano: l.publishedAt ? new Date(l.publishedAt).getFullYear().toString() : undefined,
            url: l.url,
            createdAt: l.createdAt,
        }));

        return res.json({ data: mapped, page: result.page, perPage: result.perPage, total: result.total });
    }

    async getById(req: Request, res: Response) {
        const law = await lawService.getById(req.params.id);
        if (!law) {
            return res.status(404).json({ message: "Lei não encontrada" });
        }
        // map shape for compatibility
        const mapped = {
            _id: String(law.id),
            numero: law.number,
            titulo: law.title,
            descricao: law.summary ?? null,
            texto: law.summary ?? null,
            ano: law.publishedAt ? new Date(law.publishedAt).getFullYear().toString() : undefined,
            url: law.url,
            createdAt: law.createdAt,
        };

        return res.json(mapped);
    }

    async create(req: Request, res: Response) {
        // Accept both old and new field names
        const { title, number, year, description, url, summary } = req.body;

        const newLaw = await lawService.create({
            title: title ?? req.body.titulo,
            number: number ?? req.body.numero,
            summary: summary ?? description ?? null,
            url,
            publishedAt: year ? new Date(String(year)) : undefined,
        });

        const mapped = {
            _id: String(newLaw.id),
            numero: newLaw.number,
            titulo: newLaw.title,
            descricao: newLaw.summary ?? null,
            texto: newLaw.summary ?? null,
            ano: newLaw.publishedAt ? new Date(newLaw.publishedAt).getFullYear().toString() : undefined,
            url: newLaw.url,
            createdAt: newLaw.createdAt,
        };

        return res.status(201).json(mapped);
    }
}

export const lawController = new LawController();
