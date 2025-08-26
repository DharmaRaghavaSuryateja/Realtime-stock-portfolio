import axios from 'axios';
import * as cheerio from 'cheerio';
export async function getGoogleData(symbol, exchange) {
    const url = `https://www.google.com/finance/quote/${symbol}:${exchange}`;
    const { data } = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const $ = cheerio.load(data);
    let peRatio = '';
    let earnings = '';
    $('div.gyFHrc').each((_, el) => {
        const label = $(el).find('div.mfs7Fc').text().trim();
        const value = $(el).find('div.P6K39c').text().trim();
        if (label.includes('P/E ratio')) {
            peRatio = value;
        }
    });
    $('tr.roXhBd').each((_, el) => {
        const label = $(el).find('td.J9Jhg').text().trim();
        const value = $(el).find('td.QXDnM').text().trim();
        if (label.includes('Earnings per share')) {
            earnings = value;
        }
    });
    return { peRatio, earnings };
}
