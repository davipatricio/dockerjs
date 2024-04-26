import axios, { type AxiosInstance } from 'axios';
import type { DockerClient } from '..';

type HTTPMethods = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface RequestOptions {
  data?: unknown;
  method?: HTTPMethods;
  params?: Record<string, unknown> | unknown;
}

export class RestManager {
  axios: AxiosInstance;

  constructor(public client: DockerClient) {
    this.axios = axios.create({
      baseURL: `http://localhost/${client.options.dockerVersion}`,
      socketPath: client.options.socketPath,
      timeout: client.options.timeout,
      validateStatus: () => true
    });
  }

  async request<T>(path: string, { method, data, params } = {} as RequestOptions) {
    if (path.startsWith('/')) {
      throw new Error(`Path must not start with /: ${path}`);
    }

    const req = await this.axios<T>(path, {
      method: method ?? 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      params,
      data
    });

    if (req.status >= 400 && req.status < 500) {
      // @ts-expect-error
      throw new Error(req.data.message ?? JSON.stringify(req.data));
    }

    return req;
  }
}
