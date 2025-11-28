import axios from 'axios';
import cheerio from 'cheerio';
import { createOrUpdateLaw } from '../laws/law.service';////modules/laws/law.service
import dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

export const crawlLaws = async () => {
  const url = process.env.GOVERNMENT_SITE_URL || 'https://www.planalto.gov.br/ccivil_03/leis/';
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Placeholder scraping logic; adjust selectors based on actual site
  const links = $('a[href*="L"]');
  for (const el of links.toArray()) {
    const $el = $(el);
    const link = $el.attr('href');
    const number = $el.text().match(/Lei n° (\d+)/)?.[1];
    if (link && number) {
      const fullUrl = new URL(link, url).href;
      const lawResponse = await axios.get(fullUrl);
      const law$ = cheerio.load(lawResponse.data);
      const text = law$('body').text().trim();  // Simplify
      const date = law$('date-selector').text() || new Date().toISOString();  // Placeholder

      await createOrUpdateLaw({
        title: `Lei ${number}`,
        url: fullUrl,
        number,
        text,
        date: new Date(date),
      });
    }
  }
};