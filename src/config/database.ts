import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            log: ["query", "info", "warn", "error"],
        });
    }

    async onModuleInit() {
        try {
            await this.$connect();
            console.log("📌 Banco de dados conectado com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao conectar no banco:", error);
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}

export default DatabaseService;
