// src/modules/laws/law.model.ts

export interface Law {
    id: string;
    title: string;
    number: string;
    year: string;
    description: string;
    url: string;
    createdAt: Date;
}
