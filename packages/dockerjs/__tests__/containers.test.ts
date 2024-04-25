import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { DockerClient } from '../dist/index';

describe('@dockerjs/docker-js | containers', () => {
  const client = new DockerClient();

  const cleanup = async () => {
    const containers = await client.containers.get({ all: true });
    const container = containers.find((container) => container.Names.includes('/dockerjs-test'));

    if (container) await client.containers.delete(container.Id);
  };

  beforeAll(async () => {
    await cleanup();
  });

  afterAll(async () => {
    await cleanup();
  });

  test('docker client should be defined', () => {
    expect(client).toBeDefined();
  });

  test('pull hello-world image', async () => {
    try {
      await client.images.pull({ name: 'hello-world', version: 'linux' });
    } catch (e) {
      console.log(e);
    }
  });

  test('create container from image hello-world', async (ctx) => {
    const container = await client.containers.create('dockerjs-test', {
      Image: 'hello-world:linux',
      Tty: true
    });

    expect(container).toBeDefined();
    expect(container.Id).toBeTypeOf('string');
  });

  test('list all containers', async () => {
    const containers = await client.containers.get();

    expect(containers).toBeDefined();
    expect(Array.isArray(containers)).toBe(true);
    expect(containers.length).toBeGreaterThanOrEqual(0);

    if (containers[0]) {
      expect(containers[0]).toBeDefined();
      expect(containers[0].Id).toBe('string');
      expect(containers[0].Names.length).toBeGreaterThanOrEqual(0);
      expect(containers[0].Image).toBe('string');
      expect(containers[0].Command).toBe('string');

      expect(Array.isArray(containers[0].Names)).toBe(true);
    }
  });
});
