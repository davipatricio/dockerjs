import {
  ContainerWaitOptions,
  PruneContainersInfo,
  type ContainerCreateOptions,
  type ContainerInfo,
  type ContainerInspectInfo,
  type ContainerListOptions,
  type ContainerRemoveOptions,
  type ContainerStopOptions
} from 'dockerode';
import type { DockerClient } from '../client';
import type { ContainerRenameOptions, ContainerWaitResult, CreateContainer, ListContainerProcesses } from '../types/docker';

export class ContainerHandler {
  // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
  constructor(public client: DockerClient) {}

  /**
   * Creates a new container
   */
  async create(name: string, options: Omit<ContainerCreateOptions, 'name'>) {
    const req = await this.client.rest.request<CreateContainer>('containers/create', {
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

  /**
   * Gets a container or the list of containers
   * @param data - Options
   * @returns {Promise<ContainerInspectInfo | ContainerInfo[]>}
   */
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

  /**
   * List processes running inside a container
   * On Unix systems, this is done by running the ps command. This endpoint is not supported on Windows.
   * @param id - ID of the container
   */
  async listProcesses(id: string) {
    const req = await this.client.rest.request<ListContainerProcesses>(`containers/${id}/top`, {
      method: 'GET'
    });

    return req.data;
  }

  /**
   * Starts a stopped container. Throws if the container is already running
   * @param id - ID of the container
   */
  async start(id: string) {
    await this.client.rest.request(`containers/${id}/start`, {
      method: 'POST'
    });
  }

  /**
   * Stops a running container. Throws if the container is already stopped
   * @param id - ID of the container
   */
  async stop(id: string, options?: ContainerStopOptions) {
    await this.client.rest.request(`containers/${id}/stop`, {
      method: 'POST',
      params: options
    });
  }

  /**
   * Stops a running container. Throws if the container is already stopped
   * @param id - ID of the container
   */
  async restart(id: string, options?: ContainerStopOptions) {
    await this.client.rest.request(`containers/${id}/restart`, {
      method: 'POST',
      params: options
    });
  }

  /**
   * Kills a running container. Throws if the container is already stopped
   * @param id - ID of the container
   */
  async kill(id: string, options?: Omit<ContainerStopOptions, 't'>) {
    await this.client.rest.request(`containers/${id}/kill`, {
      method: 'POST',
      params: options
    });
  }

  /**
   * Use the freezer cgroup to suspend all processes in a container.
   * @param id - ID of the container
   */
  async pause(id: string) {
    await this.client.rest.request(`containers/${id}/pause`, {
      method: 'POST'
    });
  }

  /**
   * Resume a container which has been paused.
   * @param id - ID of the container
   */
  async unpause(id: string) {
    await this.client.rest.request(`containers/${id}/unpause`, {
      method: 'POST'
    });
  }

  /**
   * Renames a container
   * @param id - ID of the container
   */
  async rename(id: string, options?: ContainerRenameOptions) {
    await this.client.rest.request(`containers/${id}/rename`, {
      method: 'POST',
      params: options
    });
  }

  /**
   * Prune unused containers
   */
  async prune() {
    const req = await this.client.rest.request<PruneContainersInfo>('containers/prune', {
      method: 'POST'
    });

    return req.data;
  }

  /**
   * Block until a container stops, then returns the exit code.
   * @param id - ID of the container
   */
  async wait(id: string, options?: ContainerWaitOptions) {
    const req = await this.client.rest.request<ContainerWaitResult>(`containers/${id}/wait`, {
      method: 'POST',
      params: options,
      timeout: Number.POSITIVE_INFINITY
    });

    return req.data;
  }
}
