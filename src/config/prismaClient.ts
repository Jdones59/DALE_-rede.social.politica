import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "warn", "error"],
});

export default prisma;

export async function connectPrisma() {
  try {
    await prisma.$connect();
    console.log("Prisma conectado ao PostgreSQL!");
  } catch (e) {
    console.error("Erro ao conectar Prisma:", e);
  }
}
