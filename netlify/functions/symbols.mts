import type { Config } from '@netlify/functions';
import { ofetch } from 'ofetch';

export default async function () {
  const API_KEY = process.env.API_KEY;
  try {
    const response = await ofetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/codes`,
    );
    if (response.result === 'error') {
      return Response.json(
        {
          success: false,
          message: `API error: ${response['error-type']}`,
        },
        {
          status: 500,
        },
      );
    }

    const symbols = (response.supported_codes as [string, string][]).map(
      ([code, description]) => ({
        code,
        description,
      }),
    );

    return Response.json({
      success: true,
      symbols,
    });
  } catch (e) {
    return Response.json(
      {
        success: false,
        message: `API error: ${(e as Error).message}`,
      },
      {
        status: 500,
      },
    );
  }
}

export const config: Config = {
  path: '/api/symbols',
};
