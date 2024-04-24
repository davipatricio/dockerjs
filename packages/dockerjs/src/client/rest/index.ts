import { Agent, request, setGlobalDispatcher } from 'undici';
import type { DockerClient } from '..';

type HTTPMethods = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface RequestOptions {
  data?: unknown;
  method?: HTTPMethods;
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

  async request<T>(path: string, { method, data } = { method: 'GET' } as RequestOptions) {
    const baseURL = `http://localhost/${this.client.options.dockerVersion}`;

    if (path.startsWith('/')) {
      throw new Error(`Path must not start with /: ${path}`);
    }

    const req = await request(`${baseURL}/${path}`, {
      method: method as never,
      headers: {
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : null
    });

    const json = await req.body.json();

    return json as T;
  }
}
