import { IConsumptionsResponse } from 'ficus-models/lib/consumption';
import { DateTime } from 'luxon';

const BASE_URL: string = process.env.REACT_APP_API_URL ?? '';

export const getVmsConsumption = async (from: DateTime, to: DateTime): Promise<IConsumptionsResponse> => {
  const getConsumptionUrl = new URL(`${BASE_URL}/resources/vms/consumption`);
  getConsumptionUrl.searchParams.append('from', from.toISO());
  getConsumptionUrl.searchParams.append('to', to.toISO());
  getConsumptionUrl.searchParams.append('aggregate', 'median');

  const vmsConsumptionResult = await fetch(getConsumptionUrl).then((res) => res.json());

  return vmsConsumptionResult as IConsumptionsResponse;
};

export default getVmsConsumption;
