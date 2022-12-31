import { InfluxDB, QueryApi } from '@influxdata/influxdb-client';
import { catchError, from, Observable } from 'rxjs';
import influxdbConfig from '../../../config/influxdb';

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

  public listVirtualMachines(): Observable<any> {
    const fluxQuery =
      'from(bucket:"ficus-agent") |> range(start: -1mo) |> filter(fn: (r) => r._measurement == "vm" and r._field == "is_running")';
    return from(this.client.rows(fluxQuery)).pipe(
      catchError((e) => {
        console.error('influxdb error:', e);
        throw new Error('Unable to contact influxdb');
      }),
    );
  }
}
