#!/usr/bin/env node
import prisma, { connectPrisma } from '../config/prismaClient';
import { crawlLaws } from '../modules/crawler/laws_crawler';

async function main() {
  console.log('Connecting Prisma...');
  await connectPrisma();

  // You can pass an argument to limit the number of items processed: --limit=50
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined;

  const startUrlArg = process.argv.find((a) => a.startsWith('--start='));
  const start = startUrlArg ? startUrlArg.split('=')[1] : undefined;

  console.log('Fetching candidate law links from planalto...');
  // The crawler will discover candidate links; for safety we will process only links
  // that look like law pages (heuristic: include 'lei' or '/leis/')
  const results: any[] = [];
  // crawlLaws currently uses a simple href/text extractor and returns many results.
  // To avoid overloading, run the crawler and then filter.
  await crawlLaws(start);

  // Because the simple crawler currently calls a callback and doesn't return
  // results directly, let's perform a minimal fetch of the start page and parse
  // links using axios/cheerio inline to build a first batch.
  const axios = (await import('axios')).default;
  const cheerio = (await import('cheerio'));

  const base = start || 'https://www4.planalto.gov.br/legislacao/leis';
  console.log('Loading listing page:', base);
  const res = await axios.get(base);
  const $ = cheerio.load(res.data);

  $('a').each((_, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim();
    if (!href) return;
    // Heuristic for law pages
    const candidate = href.toLowerCase().includes('lei') || href.toLowerCase().includes('/leis');
    if (candidate) {
      const url = href.startsWith('http') ? href : new URL(href, base).toString();
      results.push({ title: text || url, url });
    }
  });

  console.log(`Found ${results.length} candidate links (will filter duplicates).`);

  const unique = Array.from(new Map(results.map((r) => [r.url, r])).values());
  const toProcess = typeof limit === 'number' ? unique.slice(0, limit) : unique;

  console.log('Processing', toProcess.length, 'items...');

  for (const item of toProcess) {
    try {
      // Basic clean: title, url
      // Try to parse a number/year out of the title (simple regex)
      const numberMatch = item.title.match(/lei\s+n[oº]\.?\s*(\d+)/i) || item.title.match(/(\d{2,6})/);
      const number = numberMatch ? numberMatch[1] : null;

      // publishedAt unknown on listing; leave null for now

      // Upsert logic using findFirst (url not unique in schema) — update or create
      const existing = await prisma.law.findFirst({ where: { url: item.url } });

      if (existing) {
        // update if there are new fields
        await prisma.law.update({ where: { id: existing.id }, data: { title: item.title || existing.title, number: number || existing.number } });
        console.log('Updated existing law:', item.url);
      } else {
        await prisma.law.create({ data: { title: item.title || 'Untitled', url: item.url, number: number || '', summary: '', publishedAt: new Date() } });
        console.log('Inserted law:', item.url);
      }

    } catch (err) {
      console.error('Failed to import', item.url, (err as any)?.message || err);
    }
  }

  console.log('Import finished.');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
