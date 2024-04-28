export interface ListContainerProcesses {
  Titles: string[];
  Processes: string[][];
}

export interface CreateContainer {
  Id: string;
}

export interface ContainerRenameOptions {
  name: string;
}
