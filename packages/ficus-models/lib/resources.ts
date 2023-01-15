export interface IVirtualMachine {
  id: string;
  name?: string;
  provider?: string;
  isRunning?: boolean;
  cpuThreads?: number;
  memoryInMb?: number;
  tags?: { [tagName: string]: string }
}

export interface IVirtualMachineResourceResponse {
  [vmId: string]: IVirtualMachine
}
