import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { IVirtualMachineResourceResponse } from 'ficus-models/lib/resources';
import { IConsumptionsResponse, IResourcesConsumption, IResourcesConsumptions } from 'ficus-models/lib/consumption';
import { convertSnakeCaseToCamelCase } from 'ficus-models/lib/utils/data';
import InfluxService from '../../Services/Timeseries/InfluxService';
import GetConsumptionValidator from '../../Validators/GetConsumptionValidator';
import GetResourcesValidator from '../../Validators/GetResourcesValidator';

export default class VirtualMachinesController {
  public async index({ request }: HttpContextContract): Promise<IVirtualMachineResourceResponse> {
    const parameters = await request.validate(GetResourcesValidator);

    const virtualMachines = await new Promise<IVirtualMachineResourceResponse>((resolve, reject) => {
      const vms: IVirtualMachineResourceResponse = {};

      InfluxService.get().listVirtualMachinesMetrics(parameters.from, parameters.to).subscribe({
        next: ({
          id, name, provider, fieldName, fieldValue, tags,
        }) => {
          if (!vms[id]) {
            vms[id] = {
              id, name, provider, tags,
            };
          }
          vms[id] = { ...vms[id], [fieldName]: fieldValue };
        },
        complete: () => {
          resolve(vms);
        },
        error: (error) => reject(error),
      });
    });

    return convertSnakeCaseToCamelCase(virtualMachines);
  }

  public async consumption({ request }: HttpContextContract): Promise<IConsumptionsResponse> {
    const parameters = await request.validate(GetConsumptionValidator);

    const unorderedConsumptions: { [time: number]: IResourcesConsumption } = await new Promise((resolve, reject) => {
      const consumptions: { [time: number]: IResourcesConsumption } = {};

      InfluxService.get().getVirtualMachinesConsumptionMetrics(parameters.from, parameters.to, parameters.window, parameters.aggregate).subscribe({
        next: ({
          id, measurement, timestamp, fieldName, fieldValue,
        }) => {
          consumptions[timestamp] ??= {};
          consumptions[timestamp][id] ??= {};
          consumptions[timestamp][id][measurement] ??= {};
          consumptions[timestamp][id][measurement][fieldName] = fieldValue;
        },
        complete: () => {
          resolve(consumptions);
        },
        error: (error) => reject(error),
      });
    });

    const timestamps: string[] = [...new Set(Object.keys(unorderedConsumptions))];
    const aggregatedConsumptions: IResourcesConsumptions = {};
    Object.entries(unorderedConsumptions).forEach(([timestamp, consumptions]) => {
      Object.entries(consumptions).forEach(([instanceId, metrics]) => {
        aggregatedConsumptions[instanceId] ??= {};
        Object.entries(metrics).forEach(([metricName, aggregators]) => {
          aggregatedConsumptions[instanceId][metricName] ??= {};
          Object.entries(aggregators).forEach(([aggregatorName, value]) => {
            aggregatedConsumptions[instanceId][metricName][aggregatorName] ??= timestamps.map(() => undefined);
            aggregatedConsumptions[instanceId][metricName][aggregatorName][timestamps.indexOf(timestamp)] = value;
          });
        });
      });
    });

    return { timestamps, values: aggregatedConsumptions };
  }
}
