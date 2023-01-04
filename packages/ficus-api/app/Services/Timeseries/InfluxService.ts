import { InfluxDB, QueryApi } from '@influxdata/influxdb-client';
import { catchError, from, map, Observable } from 'rxjs';
import influxdbConfig from '../../../config/influxdb';

interface IInfluxResourceMetric {
  id: string;
  name: string;
  provider: string;
  fieldName: string;
  fieldValue: string;
  tags: { [tagName: string]: string };
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

  public listVirtualMachinesMetrics(): Observable<IInfluxResourceMetric> {
    const fluxQuery =
      'from(bucket:"ficus-agent") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "vm" and contains(value: r._field, set: ["is_running", "cpu_core", "cpu_threads", "memory_in_mb"])) |> last()';
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
        tags: Object.keys(result).filter(key => key.startsWith('tag:')).reduce((acc, tagName) => ({ ...acc, [tagName.replace(/^tag:/, '')]: result[tagName] }), {}) 
      })),
    );
  }
}
