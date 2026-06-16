import type { Config, Context } from '@netlify/functions';

import { ofetch } from 'ofetch';

export default async function (_req: Request, { params }: Context) {
  const API_KEY = process.env.API_KEY;
  if (!params.base) {
    return Response.json(
      {
        success: false,
        message: `API error: missing base query parameter`,
      },
      { status: 500 },
    );
  }

  const response = await ofetch(
    `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${params.base}`,
  );

  if (response.result === 'error') {
    return Response.json(
      {
        success: false,
        message: `API error: ${response['error-type']}`,
      },
      { status: 500 },
    );
  }

  return Response.json({ success: true, rates: response.conversion_rates });
}

export const config: Config = {
  path: '/api/rates/:base',
};
