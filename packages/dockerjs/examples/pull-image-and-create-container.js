import { DockerClient } from '../dist/index.js';

const client = new DockerClient();

await client.images.pull({ name: 'hello-world', version: 'linux' });

const container = await client.containers.create('ola-mundo', {
  Image: 'hello-world:linux'
});

console.log(container);
