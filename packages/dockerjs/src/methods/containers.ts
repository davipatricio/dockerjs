import type { DockerClient } from '../client';

export const createContainerHandler = (client: DockerClient) => ({
  get: async () => {
    return client.rest.request<[]>('containers/json', {
      method: 'GET'
    });
  }
});
