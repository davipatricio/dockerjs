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

export interface ContainerWaitResult {
  /**
   * Exit code of the container
   */
  StatusCode: number;
  /**
   * Container waiting error, if any
   */
  Error: {
    Message: string;
  };
}
