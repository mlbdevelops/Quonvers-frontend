import { storage } from '@/storage/mmkv';

type FetcherProps = {
  url?: string;
  useToken?: boolean;
  headers?: Record<string, string>;
  method?: 'POST' | 'GET' | 'PATCH' | 'DELETE' | 'PUT';
  body?: any;
  toJson?: boolean;
  errMsg?: string;
  sub_url?: string;
  errorLog: boolean
};

export default async function trans(sub_url: string, {
  useToken = false,
  headers = {},
  method = 'POST',
  body,
  toJson = true,
  errMsg,
  errorLog = true
}: FetcherProps) {
  try {
    const localhost = 'http://localhost:4000';
    const prod_url = 'https://exemple.com';
    let userToken: string | null = null;
    if (useToken) {
      userToken = await storage.getString('token');
    }
    //console.log(body);
    const req = await fetch(`${localhost}${sub_url}` || `${prod_url}${sub_url}`, {
      method,
      headers: {
        'Content-Type' : 'application/json',
        ...(useToken && userToken ? { 'token': userToken } : {}),
        ...headers,
      },
      body: toJson && body ? JSON.stringify(body) : body,
    });
    const res = toJson ? await req.json() : await req.text();
    return res ?? null;
  } catch (error) {
    throw new Error('An error occurred:', error);
    //errorLog && console.log(error);
    return {
      success: false,
      errMsg
    };
  }
}

export const errorType = (type, message) => { type,   message }