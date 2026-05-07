import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { colors } from '@unocss/preset-mini';

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

const countriesFile = fileURLToPath(
  import.meta.resolve('flag-icons/country.json'),
);

const generatedFile = fileURLToPath(import.meta.resolve('../public/flags.svg'));

/**
 * @type {Map<string, string>}
 */
const flags = new Map();
for (const { flag_4x3, code } of JSON.parse(
  await readFile(countriesFile, 'utf-8'),
)) {
  flags.set(code, fileURLToPath(import.meta.resolve(`flag-icons/${flag_4x3}`)));
}

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

for (const currencyCode of CURRENCY_CODES) {
  const countryCode = currencyCode.slice(0, 2).toLowerCase();

  if (!flags.has(countryCode)) {
    symbols.push(`<g id="code-${currencyCode.toLowerCase()}" viewBox="0 0 640 480" class="flag code">
      <rect width="100%" height="100%"/>
      <text x="50%" y="50%"
            font-family="Arial, Helvetica, sans-serif"
            font-size="260"
            fill="${colors.slate[400]}"
            text-anchor="middle"
            dominant-baseline="middle">
        ${currencyCode}
      </text>
    </g>`);
    continue;
  }
  const flag = flags.get(countryCode);
  const flagSVG = await readFile(flag, 'utf-8');
  const { viewBox, body } = parseSvg(flagSVG);
  symbols.push(
    currencyCode,
    `
  <g id="code-${currencyCode.toLowerCase()}" ${viewBox ? `viewBox="${viewBox}"` : ''} class="flag">
    ${body}
  </g>`,
  );
}

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="flag-icons-ad" viewBox="0 0 640 480">
  <defs>
		<style>
		.flag { display: none }
		.flag:target { display: inline }
    .flag.code rect { fill: ${colors.slate[200]}; }
    @media (prefers-color-scheme: dark) { .flag.code rect { fill: ${colors.slate[600]}; } }
		</style>
	</defs>  
  ${symbols.join('\n')}
</svg>`;

await writeFile(generatedFile, sprite);
