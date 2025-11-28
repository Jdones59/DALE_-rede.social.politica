import { crawlLaws } from '../modules/crawler/laws_crawler';

export const updateLaws = async () => {
  console.log('Updating laws...');
  await crawlLaws();
  console.log('Laws updated');
};