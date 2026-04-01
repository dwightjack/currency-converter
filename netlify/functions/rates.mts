import type { Handler } from '@netlify/functions';
import { ofetch } from 'ofetch';

const handler: Handler = async ({ queryStringParameters }) => {
  const API_KEY = process.env.API_KEY;
  if (!queryStringParameters?.base) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: `API error: missing base query parameter`,
      }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };
  }

  const response = await ofetch(
    `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${queryStringParameters.base}`,
  );

  if (response.result === 'error') {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: `API error: ${response['error-type']}`,
      }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, rates: response.conversion_rates }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };
};

export { handler };
