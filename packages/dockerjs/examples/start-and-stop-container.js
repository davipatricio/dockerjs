import { DockerClient } from '../dist/index.js';

const client = new DockerClient();

const container = await client.containers.create('ola-mundo', {
  Image: 'hello-world:linux'
});

await client.containers.start(container.Id);
await client.containers.stop(container.Id);
