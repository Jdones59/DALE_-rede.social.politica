

import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import Bottleneck from 'bottleneck';
import pRetry from 'p-retry';
import { URL } from 'url';

export type CrawledLaw = {
	title: string;
	url: string;
	number?: string | null;
	year?: string | null;
	summary?: string | null;
	rawHtml?: string | null;
};

export class LawsCrawler {
	private http: AxiosInstance;
	private limiter: Bottleneck;
	private baseUrl: string;

	constructor(baseUrl = 'https://www4.planalto.gov.br/legislacao') {
		this.baseUrl = baseUrl;
		this.http = axios.create({ timeout: 15000, headers: { 'User-Agent': 'DALE-crawler/1.0 (+https://your.site)' } });

		// Rate limiting: max 3 requests / second, burst up to 5
		this.limiter = new Bottleneck({ minTime: 350, maxConcurrent: 3 });
	}

	// Fetch a page with retries
	private async fetch(url: string) {
		return this.limiter.schedule(() =>
			pRetry(async () => {
				const res = await this.http.get(url);
				if (!res || !res.data) throw new Error('Empty response');
				return res.data as string;
			}, { retries: 3 })
		);
	}

	// Normalize relative links to absolute
	private normalizeLink(raw: string, base?: string) {
		try {
			const u = new URL(raw, base || this.baseUrl);
			return u.toString();
		} catch (e) {
			return raw;
		}
	}

	// Parse a listing page and return candidate links
	async fetchListingPages(listUrl?: string): Promise<CrawledLaw[]> {
		const url = listUrl || this.baseUrl;
		// Attempt to fetch and parse a listing page. Keep implementation minimal
		// — for production this should parse links with cheerio and return candidates.
		try {
			const html = await this.fetch(url);
			const $ = cheerio.load(html);

			// Placeholder: look for <a> tags and return list of simple mappings.
			const links: CrawledLaw[] = [];
			$('a').each((_, el) => {
				const href = $(el).attr('href');
				const text = $(el).text().trim();
				if (href && text) {
					links.push({ title: text, url: this.normalizeLink(href, url) });
				}
			});

			return links;
		} catch (e) {
			return [];
		}
	}

	// crawlAll iterates found items and optionally calls a callback for each
	async crawlAll(startUrl?: string, cb?: (law: CrawledLaw) => Promise<void>) {
		const pages = await this.fetchListingPages(startUrl);
		for (const item of pages) {
			if (cb) await cb(item);
		}
	}
}

export async function crawlLaws(startUrl?: string) {
	const crawler = new LawsCrawler(startUrl);
	await crawler.crawlAll(startUrl);
}
// end of file
