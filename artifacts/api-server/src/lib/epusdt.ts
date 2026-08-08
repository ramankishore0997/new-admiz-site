import crypto from "crypto";

// Epusdt Legacy API uses MD5 signing:
// 1. Collect all params except 'signature' and empty values
// 2. Sort by key name ASCII ascending
// 3. Concatenate as key1=value1&key2=value2
// 4. Append api_auth_token directly (no & separator)
// 5. MD5 hash → 32-char lowercase hex

export function computeSignature(params: Record<string, any>, apiToken: string): string {
  const sorted = Object.keys(params)
    .filter(k => k !== 'signature' && params[k] !== '' && params[k] !== null && params[k] !== undefined)
    .sort();
  const signStr = sorted.map(k => `${k}=${params[k]}`).join('&');
  return crypto.createHash('md5').update(signStr + apiToken).digest('hex');
}

export function verifySignature(params: Record<string, any>, signature: string, apiToken: string): boolean {
  const computed = computeSignature(params, apiToken);
  return computed === signature;
}

export interface EpusdtOrderResponse {
  trade_id: string;
  order_id: string;
  amount: number;
  actual_amount: string;
  token: string;
  expiration_time: number;
  payment_url: string;
}

export async function createEpusdtOrder(params: {
  orderId: string;
  amount: number;
  notifyUrl: string;
  redirectUrl?: string;
}): Promise<EpusdtOrderResponse> {
  const apiUrl = process.env.EPUSDT_API_URL;
  const apiToken = process.env.EPUSDT_API_TOKEN;
  
  if (!apiUrl || !apiToken || apiUrl.includes('yourdomain.com')) {
    throw new Error('Epusdt gateway URL is not configured. Please update EPUSDT_API_URL and EPUSDT_API_TOKEN in your .env file with your Epusdt instance credentials.');
  }

  const requestParams: Record<string, any> = {
    order_id: params.orderId,
    amount: params.amount,
    notify_url: params.notifyUrl,
  };
  if (params.redirectUrl) {
    requestParams.redirect_url = params.redirectUrl;
  }
  requestParams.signature = computeSignature(requestParams, apiToken);

  let response;
  try {
    response = await fetch(`${apiUrl}/api/v1/order/create-transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestParams),
    });
  } catch (err: any) {
    throw new Error(`Could not connect to Epusdt gateway at ${apiUrl} (${err.message}). Make sure your Epusdt server is running and accessible.`);
  }

  const json = (await response.json()) as any;
  
  if (json.status_code !== 200 || !json.data) {
    throw new Error(json.message || 'Failed to create Epusdt order');
  }

  return json.data;
}
