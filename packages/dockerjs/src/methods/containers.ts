import type { ContainerCreateOptions, ContainerInfo, ContainerInspectInfo, ContainerListOptions, ContainerRemoveOptions } from 'dockerode';
import type { DockerClient } from '../client';

export class ContainerHandler {
  // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
  constructor(public client: DockerClient) {}

  /**
   * Creates a new container
   */
  async create(name: string, options: Omit<ContainerCreateOptions, 'name'>) {
    return this.client.rest.request<{ Id: string }>('containers/create', {
      method: 'POST',
      data: options,
      params: {
        name
      }
    });
  }

  /**
   * Deletes a container
   */
  async delete(id: string, options?: ContainerRemoveOptions) {
    return this.client.rest.request(`containers/${id}`, {
      method: 'DELETE',
      params: options
    });
  }

  /**
   * Gets all containers that exists on the Docker host
   * @returns {Promise<ContainerInfo[]>} List of containers
   */
  get(options?: ContainerListOptions): Promise<ContainerInfo[]>;
  /**
   * Inspects a container
   * @param options - Options
   * @returns {Promise<ContainerInfo>} The inspected container
   */
  get(id?: string): Promise<ContainerInspectInfo>;
  get(data?: ContainerListOptions | string) {
    if (!data || typeof data === 'object')
      return this.client.rest.request<ContainerInfo[]>('containers/json', {
        method: 'GET',
        params: data
      });

    return this.client.rest.request<ContainerInspectInfo>(`containers/${data}/json`, {
      method: 'GET',
      params: {
        id: data
      }
    });
  }
}
