import type { ContainerCreateOptions, ContainerInfo, ContainerInspectInfo, ContainerListOptions, ContainerRemoveOptions } from 'dockerode';
import type { DockerClient } from '../client';

export class ContainerHandler {
  // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
  constructor(public client: DockerClient) {}

  /**
   * Creates a new container
   */
  async create(name: string, options: Omit<ContainerCreateOptions, 'name'>) {
    const req = await this.client.rest.request<{ Id: string }>('containers/create', {
      method: 'POST',
      data: options,
      params: {
        name
      }
    });

    return req.data;
  }

  /**
   * Deletes a container
   */
  async delete(id: string, options?: ContainerRemoveOptions) {
    await this.client.rest.request(`containers/${id}`, {
      method: 'DELETE',
      params: options
    });
  }

  /**
   * Gets all containers that exists on the Docker host
   * @returns {Promise<ContainerInfo[]>} List of containers
   */
  async get(options?: ContainerListOptions): Promise<ContainerInfo[]>;
  /**
   * Inspects a container
   * @param options - Options
   * @returns {Promise<ContainerInfo>} The inspected container
   */
  async get(id?: string): Promise<ContainerInspectInfo>;
  async get(data?: ContainerListOptions | string) {
    if (!data || typeof data === 'object') {
      const req = await this.client.rest.request<ContainerInfo[]>('containers/json', {
        method: 'GET',
        params: data
      });

      return req.data;
    }

    const req = await this.client.rest.request<ContainerInspectInfo>(`containers/${data}/json`, {
      method: 'GET',
      params: {
        id: data
      }
    });

    return req.data;
  }
}
