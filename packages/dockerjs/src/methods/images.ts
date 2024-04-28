import type { ImageInfo, ImageInspectInfo, ImageRemoveInfo, ImageRemoveOptions, ListImagesOptions, PruneImagesInfo } from 'dockerode';
import type { DockerClient } from '../client';
import type { ImagePruneOptions } from '../types/docker';

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
   * Deletes an image
   * @param name - Name of the image
   */
  async delete(name: string, options?: ImageRemoveOptions) {
    const req = await this.client.rest.request<ImageRemoveInfo>(`images/${name}`, {
      method: 'DELETE',
      params: options
    });

    return req.data;
  }

  /**
   * Returns a list of images on the server. Note that it uses a different, smaller representation of an image than inspecting a single image.
   * @param options - Options
   * @returns {Promise<ImageInfo[]>} List of containers
   */
  async get(options?: ListImagesOptions): Promise<ImageInfo[]>;

  /**
   * Inspects a image
   * @param options - Options
   * @returns {Promise<ImageInspectInfo>} The inspected image
   */
  async get(id?: string): Promise<ImageInspectInfo>;

  /**
   * Gets a image or the list of stored images
   * @param data - Options
   * @returns {Promise<ImageInspectInfo | ImageInfo[]>}
   */
  async get(data?: ListImagesOptions | string) {
    if (!data || typeof data === 'object') {
      const req = await this.client.rest.request<ImageInfo[]>('images/json', {
        method: 'GET',
        params: data
      });

      return req.data;
    }

    const req = await this.client.rest.request<ImageInspectInfo>(`images/${data}/json`, {
      method: 'GET',
      params: {
        name: data
      }
    });

    return req.data;
  }

  /**
   * Pulls an image from the docker registry
   * @param options - Options
   */
  async pull(options: ImagePullOptions) {
    await this.client.rest.request('images/create', {
      method: 'POST',
      params: options
    });

    return;
  }

  /**
   * Delete builder cache
   * @param options - Options
   */
  async prune(options?: ImagePruneOptions) {
    const req = await this.client.rest.request<PruneImagesInfo>('images/prune', {
      method: 'POST',
      params: options
    });

    return req.data;
  }
}
