import type { DockerClient } from '../client';

interface ImagePullOptions {
  /**
   * Name of the image to pull. The name may include a tag or digest. This parameter may only be used when pulling an image. The pull is cancelled if the HTTP connection is closed.
   */
  fromImage?: string;
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
  async pull(options: ImagePullOptions) {
    await this.client.rest.request('images/create', {
      method: 'POST',
      params: options
    });

    return;
  }
}
