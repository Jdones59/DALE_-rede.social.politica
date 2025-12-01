// src/modules/laws/law.service.ts

import prisma from "../../config/prismaClient";
import type { Law } from "@prisma/client";

export class LawService {
    // Returns pagination object with data + metadata
    async getAll(page = 1, perPage = 50): Promise<{ data: Law[]; page: number; perPage: number; total: number }> {
        const p = Math.max(1, Number(page) || 1);
        const limit = Math.max(1, Number(perPage) || 50);
        const skip = (p - 1) * limit;

        const [data, total] = await Promise.all([
            prisma.law.findMany({ orderBy: { publishedAt: "desc" }, skip, take: limit }),
            prisma.law.count(),
        ]);

        return { data, page: p, perPage: limit, total };
    }

    async getById(id: string | number): Promise<Law | null> {
        const nid = Number(id);
        if (!Number.isFinite(nid)) return null;
        return prisma.law.findUnique({ where: { id: nid } });
    }

    async create(data: { number: string; title: string; summary?: string | null; publishedAt?: Date; url?: string }): Promise<Law> {
        const created = await prisma.law.create({
            data: {
                number: data.number ?? "",
                title: data.title ?? "Untitled",
                summary: data.summary ?? '',
                publishedAt: data.publishedAt ?? new Date(),
                url: data.url ?? "",
            },
        });

        return created;
    }

    async importLaw(title: string, url: string, opts?: { number?: string | null; year?: string | null; summary?: string | null }) : Promise<Law> {
        const existing = await prisma.law.findFirst({ where: { url } });
        if (existing) return existing;

        const created = await prisma.law.create({
            data: {
                number: opts?.number ?? '',
                title: title ?? 'Untitled',
                summary: opts?.summary ?? '',
                publishedAt: new Date(),
                url: url ?? ''
            }
        });

        return created;
    }
}

export const lawService = new LawService();
