import type { ContainerInfo } from 'dockerode';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { DockerClient } from '../dist/index';

describe('@dockerjs/docker-js | containers', () => {
  const client = new DockerClient();

  const getTestContainer = async () => {
    const containers = await client.containers.get({ all: true });
    const container = containers.find((container) => container.Names.includes('/dockerjs-test'));

    return container as ContainerInfo;
  };

  const cleanup = async () => {
    const container = await getTestContainer();
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
      await client.images.pull({ fromImage: 'hello-world' });
    } catch (e) {
      console.log(e);
    }
  });

  test('create container from image hello-world', async () => {
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

  test('start container', async () => {
    const container = await getTestContainer();
    expect(container).toBeDefined();

    await client.containers.start(container.Id);
  });

  test('stop container', async () => {
    const container = await getTestContainer();
    expect(container).toBeDefined();

    await client.containers.stop(container.Id);
  });
});
