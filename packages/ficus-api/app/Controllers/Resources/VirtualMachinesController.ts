import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { IVirtualMachine } from 'ficus-models/lib/resources';
import InfluxService from '../../Services/Timeseries/InfluxService';

export default class VirtualMachinesController {
  public async index(_ctxIgnored: HttpContextContract) {
    return await new Promise((resolve, reject) => {
      const vms: { [id: string]: IVirtualMachine } = {};
      InfluxService.get().listVirtualMachinesMetrics().subscribe({
        next: ({ id, name, provider, fieldName, fieldValue, tags }) => {
          if (!vms[id]) {
            vms[id] = { id, name, provider, tags };
          }
          vms[id] = { ...vms[id],  [fieldName]: fieldValue };
        },
        complete: () => {
          resolve(vms);
        },
        error: error => reject(error),
      });
    });
  }
}
