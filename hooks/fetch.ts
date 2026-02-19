import AsyncStorage from '@react-native-async-storage/async-storage';

type Fetcher = {
  url?: string;
  useToken?: boolean;
  headers?: Record<string, string>;
  method?: string;
  body?: any;
  toJson?: boolean;
  errMsg?: string;
  sub_url?: string;
};

export default async function trans(sub_url: string, {
  useToken = false,
  headers = {},
  method = 'POST',
  body,
  toJson = true,
  errMsg
}: Fetcher) {
  try {
    const localhost = 'http://localhost:4000';
    const prod_url = 'https://exemple.com';
    let userToken: string | null = null;
    if (useToken) {
      userToken = await AsyncStorage.getItem('token');
    }
    //console.log(body);
    const req = await fetch(`${localhost}${sub_url}` || `${prod_url}${sub_url}`, {
      method,
      headers: {
        ...(useToken && userToken ? { 'token': userToken } : {}),
        ...headers,
      },
      body: toJson && body ? JSON.stringify(body) : body,
    });
    const res = toJson ? await req.json() : await req.text();
    return res ?? null;
  } catch (error) {
    console.log(error);
  }
}