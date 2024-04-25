import type { DockerClient } from '../client';

interface ImagePullOptions {
  name: string;
  /**
   * Defaults to `latest`
   */
  version?: string;
  /**
   * Source to import. The value may be a URL from which the image can be retrieved or - to read the image from the request body.
   */
  fromSrc?: string;
  /**
   * Tag or digest. If empty when pulling an image, this causes all tags for the given image to be pulled.
   */
  tag?: string;
  platform?: string;
}

export class ImageHandler {
  // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
  constructor(public client: DockerClient) {}

  /**
   * Pulls an image from the docker registry
   */
  pull({ name, version, fromSrc, tag, platform }: ImagePullOptions) {
    return this.client.rest.request('images/create', {
      method: 'POST',
      params: {
        fromImage: `${name}:${version ?? 'latest'}`,
        fromSrc,
        tag,
        platform
      }
    });
  }
}
