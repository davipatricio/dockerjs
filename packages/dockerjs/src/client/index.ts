import { createContainerHandler } from '../methods/containers';
import { RestManager } from './rest';

export interface DockerClientOptions {
  dockerVersion: string;
  timeout: number;
  socketPath: string;
}

export class DockerClient {
  options: DockerClientOptions;
  rest: RestManager;

  containers: ReturnType<typeof createContainerHandler>;

  constructor(options?: Partial<DockerClientOptions>) {
    this.options = {
      dockerVersion: 'v1.45',
      timeout: 30000,
      socketPath: '/var/run/docker.sock',
      ...options
    };

    this.rest = new RestManager(this);
    this.containers = createContainerHandler(this);
  }
}
