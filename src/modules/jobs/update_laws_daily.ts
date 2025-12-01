import { LawsCrawler, CrawledLaw } from '../crawler/laws_crawler';
import cron from 'node-cron';
import { lawService } from '../laws/law.service';


export class UpdateLawsDailyJob {
	private crawler: LawsCrawler;
	private lawService = lawService;

	constructor() {
		this.crawler = new LawsCrawler();
	}


// run once now
	async runOnce() {
		console.log('Iniciando job de atualização de leis...');
		await this.crawler.crawlAll(undefined, async (item: CrawledLaw) => {
try {
// LawService.importLaw should be idempotent: find or create by url
				await this.lawService.importLaw(item.title, item.url, { number: item.number, year: item.year, summary: item.summary });
console.log(`Importada: ${item.title}`);
} catch (err) {
	console.error('Erro ao importar lei:', item.url, (err as any)?.message || err);
}
});
console.log('Job finalizado.');
}


// schedule: daily at 03:30 AM server time
scheduleDaily(cronExpr = '30 3 * * *') {
cron.schedule(cronExpr, async () => {
try {
await this.runOnce();
		} catch (err) {
			console.error('Erro no job agendado:', (err as any)?.message || err);
		}
});
console.log('Job de atualização de leis agendado (daily at 03:30)');
}
}
