import { describe, expect, test } from 'vitest';
import { DockerClient } from '../dist/index';

describe('@dockerjs/docker-js | containers', () => {
  const client = new DockerClient();

  test('docker client should be defined', () => {
    expect(client).toBeDefined();
  });

  test('list all containers', async () => {
    const containers = await client.containers.get();

    expect(containers).toBeDefined();
    expect(Array.isArray(containers)).toBe(true);
    expect(containers.length).toBeGreaterThanOrEqual(0);
  });
});
