export interface IVirtualMachine {
  id: string;
  name?: string;
  provider?: string;
  isRunning?: boolean;
  tags?: { [tagName: string]: string }
}

export interface IVirtualMachineResourceResponse {
  [vmId: string]: IVirtualMachine
}
