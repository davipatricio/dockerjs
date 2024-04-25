import { Agent, request, setGlobalDispatcher } from 'undici';
import type { DockerClient } from '..';

type HTTPMethods = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface RequestOptions {
  data?: unknown;
  method?: HTTPMethods;
  query?: Record<string, unknown> | unknown;
}

export class RestManager {
  constructor(public client: DockerClient) {
    setGlobalDispatcher(
      new Agent({
        connectTimeout: client.options.timeout,
        socketPath: client.options.socketPath
      })
    );
  }

  async request<T>(path: string, { method, data, query } = {} as RequestOptions) {
    const baseURL = `http://localhost/${this.client.options.dockerVersion}`;

    if (path.startsWith('/')) {
      throw new Error(`Path must not start with /: ${path}`);
    }

    const req = await request(`${baseURL}/${path}`, {
      method: method ?? 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      query: query ?? {},
      body: data ? JSON.stringify(data) : null
    });

    const json = await req.body.json();

    return json as T;
  }
}
