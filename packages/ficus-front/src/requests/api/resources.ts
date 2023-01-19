import { IVirtualMachineResourceResponse } from 'ficus-models/lib/resources';
import { DateTime } from 'luxon';

const BASE_URL: string = process.env.REACT_APP_API_URL ?? '';

export const getExistingVms = async (): Promise<IVirtualMachineResourceResponse> => {
  const getVmsUrl = new URL(`${BASE_URL}/resources/vms`);
  getVmsUrl.searchParams.append('from', DateTime.now().minus({ week: 1 }).toISO());
  getVmsUrl.searchParams.append('to', DateTime.now().toISO());

  const vmsResult = await fetch(getVmsUrl).then((res) => res.json());

  return vmsResult as IVirtualMachineResourceResponse;
};

export default getExistingVms;
