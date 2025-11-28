// src/modules/laws/law.service.ts

import { Law } from "./law.model";

export class LawService {
    private laws: Law[] = []; // banco temporário (depois você coloca Prisma/Mongo)

    async getAll(): Promise<Law[]> {
        return this.laws;
    }

    async getById(id: string): Promise<Law | null> {
        return this.laws.find((l) => l.id === id) || null;
    }

    async create(data: Omit<Law, "id" | "createdAt">): Promise<Law> {
        const newLaw: Law = {
            id: Date.now().toString(),
            createdAt: new Date(),
            ...data,
        };

        this.laws.push(newLaw);
        return newLaw;
    }
}

export const lawService = new LawService();
