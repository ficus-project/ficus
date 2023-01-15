import { InfluxDB, QueryApi } from '@influxdata/influxdb-client';
import { EAggregateFunctions } from 'ficus-models/lib/consumption';
import { DateTime } from 'luxon';
import {
  catchError, from, map, Observable,
} from 'rxjs';
import influxdbConfig from '../../../config/influxdb';

interface IInfluxMetric {
  id: string;
  fieldName: string;
  fieldValue: any;
}

interface IInfluxResourceMetric extends IInfluxMetric {
  name: string;
  provider: string;
  tags: { [tagName: string]: string };
}

interface IInfluxConsumptionMetric extends IInfluxMetric {
  measurement: string;
  start: string;
  stop: string;
  timestamp: number;
}

export default class InfluxService {
  private static instance: InfluxService | undefined;

  private client: QueryApi;

  public static get(): InfluxService {
    if (!this.instance) {
      this.instance = new InfluxService();
    }
    return this.instance;
  }

  private constructor() {
    this.client = new InfluxDB({
      url: influxdbConfig.host,
      token: influxdbConfig.token,
    }).getQueryApi(influxdbConfig.organization);
  }

  public listVirtualMachinesMetrics(start: DateTime = DateTime.now().minus({ days: 1 }), stop: DateTime = DateTime.now()): Observable<IInfluxResourceMetric> {
    const fluxQuery =
      `from(bucket:"ficus-agent") |> range(start: ${start}, stop: ${stop}) |> filter(fn: (r) => r._measurement == "vm" and contains(value: r._field, set: ["is_running", "cpu_core", "cpu_threads", "memory_in_mb"])) |> last()`;
    return from(this.client.rows(fluxQuery)).pipe(
      catchError((e) => {
        console.error('influxdb error:', e);
        throw new Error('Unable to contact influxdb');
      }),
      map((row) => row.tableMeta.toObject(row.values)),
      map((result) => ({
        id: result.id,
        name: result.name,
        provider: result.provider,
        fieldName: result._field,
        fieldValue: result._value,
        tags: Object.keys(result).filter((key) => key.startsWith('tag:')).reduce((acc, tagName) => ({ ...acc, [tagName.replace(/^tag:/, '')]: result[tagName] }), {}),
      })),
    );
  }

  public getVirtualMachinesConsumptionMetrics(start: DateTime, stop: DateTime, window = '1d', aggregator: EAggregateFunctions = EAggregateFunctions.MEAN): Observable<IInfluxConsumptionMetric> {
    const fluxQuery =
      `from(bucket:"ficus-agent") |> range(start: ${start}, stop: ${stop}) |> filter(fn: (r) => r._measurement == "vm_cpu" and contains(value: r._field, set: ["average", "sum"])) |> window(every: ${window}) |> ${aggregator}()`;
    return from(this.client.rows(fluxQuery)).pipe(
      catchError((e) => {
        console.error('influxdb error:', e);
        throw new Error('Unable to contact influxdb');
      }),
      map((row) => row.tableMeta.toObject(row.values)),
      map((result) => ({
        id: result.host ?? result.id, // @todo change to id
        measurement: result._measurement,
        start: result._start,
        stop: result._stop,
        timestamp: DateTime.fromISO(result._stop).toSeconds(),
        fieldName: result._field,
        fieldValue: result._value,
      })),
    );
  }
}
