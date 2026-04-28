import { readFile, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const CURRENCY_CODES = [
  'AED',
  'AFN',
  'ALL',
  'AMD',
  'ANG',
  'AOA',
  'ARS',
  'AUD',
  'AWG',
  'AZN',
  'BAM',
  'BBD',
  'BDT',
  'BGN',
  'BHD',
  'BIF',
  'BMD',
  'BND',
  'BOB',
  'BRL',
  'BSD',
  'BTN',
  'BWP',
  'BYN',
  'BZD',
  'CAD',
  'CDF',
  'CHF',
  'CLF',
  'CLP',
  'CNH',
  'CNY',
  'COP',
  'CRC',
  'CUP',
  'CVE',
  'CZK',
  'DJF',
  'DKK',
  'DOP',
  'DZD',
  'EGP',
  'ERN',
  'ETB',
  'EUR',
  'FJD',
  'FKP',
  'FOK',
  'GBP',
  'GEL',
  'GGP',
  'GHS',
  'GIP',
  'GMD',
  'GNF',
  'GTQ',
  'GYD',
  'HKD',
  'HNL',
  'HRK',
  'HTG',
  'HUF',
  'IDR',
  'ILS',
  'IMP',
  'INR',
  'IQD',
  'IRR',
  'ISK',
  'JEP',
  'JMD',
  'JOD',
  'JPY',
  'KES',
  'KGS',
  'KHR',
  'KID',
  'KMF',
  'KRW',
  'KWD',
  'KYD',
  'KZT',
  'LAK',
  'LBP',
  'LKR',
  'LRD',
  'LSL',
  'LYD',
  'MAD',
  'MDL',
  'MGA',
  'MKD',
  'MMK',
  'MNT',
  'MOP',
  'MRU',
  'MUR',
  'MVR',
  'MWK',
  'MXN',
  'MYR',
  'MZN',
  'NAD',
  'NGN',
  'NIO',
  'NOK',
  'NPR',
  'NZD',
  'OMR',
  'PAB',
  'PEN',
  'PGK',
  'PHP',
  'PKR',
  'PLN',
  'PYG',
  'QAR',
  'RON',
  'RSD',
  'RUB',
  'RWF',
  'SAR',
  'SBD',
  'SCR',
  'SDG',
  'SEK',
  'SGD',
  'SHP',
  'SLE',
  'SLL',
  'SOS',
  'SRD',
  'SSP',
  'STN',
  'SYP',
  'SZL',
  'THB',
  'TJS',
  'TMT',
  'TND',
  'TOP',
  'TRY',
  'TTD',
  'TVD',
  'TWD',
  'TZS',
  'UAH',
  'UGX',
  'USD',
  'UYU',
  'UZS',
  'VES',
  'VND',
  'VUV',
  'WST',
  'XAF',
  'XCD',
  'XCG',
  'XDR',
  'XOF',
  'XPF',
  'YER',
  'ZAR',
  'ZMW',
  'ZWG',
  'ZWL',
];

const SHORT_CURRENCY_CODES = CURRENCY_CODES.reduce((ret, code) => {
  ret[code.slice(0, 2)] = code;
  return ret;
}, {});

const countriesFile = fileURLToPath(
  import.meta.resolve('flag-icons/country.json'),
);

const generatedFile = fileURLToPath(import.meta.resolve('../public/flags.svg'));

const flags = JSON.parse(await readFile(countriesFile, 'utf-8'))
  .map((c) => fileURLToPath(import.meta.resolve(`flag-icons/${c.flag_4x3}`)))
  .sort();

/**
 * Extract viewBox + inner content from an SVG file
 * @param {string} content
 */
function parseSvg(content) {
  const viewBox = content.match(/viewBox="([^"]+)"/i)?.[1];

  const body = content.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)?.[1]?.trim();

  return { viewBox, body };
}

/**
 * @type {string[]}
 */
const symbols = [];

for (const flag of flags) {
  const countryCode = basename(flag, '.svg').toUpperCase();
  if (!Object.hasOwn(SHORT_CURRENCY_CODES, countryCode)) {
    continue;
  }
  const flagSVG = await readFile(flag, 'utf-8');
  const { viewBox, body } = parseSvg(flagSVG);
  const currencyCode = SHORT_CURRENCY_CODES[countryCode].toLowerCase();
  symbols.push(`
  <g id="code-${currencyCode}" ${viewBox ? `viewBox="${viewBox}"` : ''} class="flag">
    ${body}
  </g>`);
}

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="flag-icons-ad" viewBox="0 0 640 480">
  <defs>
		<style>
		.flag { display: none }
		.flag:target { display: inline }
		</style>
	</defs>  
${symbols.join('\n')}
</svg>`;

await writeFile(generatedFile, sprite);
