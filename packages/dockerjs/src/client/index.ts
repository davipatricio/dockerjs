import { ContainerHandler } from '../methods/containers';
import { ImageHandler } from '../methods/images';
import { RestManager } from './rest';

export interface DockerClientOptions {
  dockerVersion: string;
  timeout: number;
  socketPath: string;
}

export class DockerClient {
  options: DockerClientOptions;
  rest: RestManager;

  containers = new ContainerHandler(this);
  images = new ImageHandler(this);

  constructor(options?: Partial<DockerClientOptions>) {
    this.options = {
      dockerVersion: 'v1.45',
      timeout: 30000,
      socketPath: '/var/run/docker.sock',
      ...options
    };

    this.rest = new RestManager(this);
  }
}
