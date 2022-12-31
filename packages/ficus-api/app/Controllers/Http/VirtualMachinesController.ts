import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
// import { IVirtualMachine } from 'ficus-models/lib/resources';
import InfluxService from '../../Services/Timeseries/InfluxService';

export default class VirtualMachinesController {
  public async index(_ctxIgnored: HttpContextContract) {
    // const vm: IVirtualMachine = {};
    // const ficus: Ficus | null = null;
    const vms = await InfluxService.get().listVirtualMachines().toPromise();
    return vms;
  }
}
