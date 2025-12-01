#!/usr/bin/env node
import prisma, { connectPrisma } from '../config/prismaClient';

async function main() {
  await connectPrisma();

  // Accept a --count=<n> argument
  const countArg = process.argv.find((a) => a.startsWith('--count='));
  const count = countArg ? Number(countArg.split('=')[1]) : 50;

  console.log(`Seeding database with ${count} sample laws...`);

  const created: any[] = [];
  for (let i = 1; i <= count; i++) {
    const num = (1000 + i).toString();
    const title = `Lei Exemplo ${num}`;
    const url = `https://example.local/leis/${num}`;
    const summary = `Resumo fictício da Lei Exemplo ${num}. Conteúdo de teste.`;
    const publishedAt = new Date(2000 + (i % 25), 0, 1);

    const law = await prisma.law.create({
      data: {
        number: num,
        title,
        summary,
        url,
        publishedAt,
      },
    });

    created.push(law);
  }

  console.log(`Inserted ${created.length} laws.`);
  await prisma.$disconnect();
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
