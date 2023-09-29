import type { Handler } from '@netlify/functions';
import { ofetch } from 'ofetch';

const handler: Handler = async () => {
  const API_KEY = process.env.API_KEY;
  const response = await ofetch(
    `https://v6.exchangerate-api.com/v6/${API_KEY}/codes`,
  );

  if (response.result === 'error') {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: `API error: ${response['error-type']}`,
      }),
    };
  }

  const symbols = (response.supported_codes as [string, string][]).map(
    ([code, description]) => ({
      code,
      description,
    }),
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, symbols }),
  };
};

export { handler };
