import { IConsumptionsResponse } from 'ficus-models/lib/consumption';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import {
  Legend,
  Line, LineChart, Tooltip, XAxis, YAxis,
} from 'recharts';
import { ChartsDatapoint } from '../../../../models/ChartsModels';
import { getVmsConsumption } from '../../../../requests/api/consumption';

const convertConsumptionsToRechartsPoint = (consumptions: IConsumptionsResponse): ChartsDatapoint[] => {
  const datapoints: ChartsDatapoint[] = consumptions.timestamps.map((timestamp) => ({ name: timestamp }));

  Object.entries(consumptions.values).forEach(([vmId, vmMetrics]) => {
    vmMetrics.vmCpu?.average?.forEach?.((avg, index) => {
      if (avg) datapoints[index][vmId] = avg;
    });
  });

  return datapoints;
};

function ResourcesConsumption() {
  const [consumptionPoints, setConsumptionPoints] = useState<ChartsDatapoint[]>();
  const [vmsNames, setVmsNames] = useState<string[]>([]);
  const [from, setFrom] = useState<DateTime>(DateTime.now().minus({ weeks: 7 }));
  const [to, setTo] = useState<DateTime>(DateTime.now());

  useEffect(() => {
    getVmsConsumption(from, to).then((vmsConsumptionResponse) => {
      setVmsNames(Object.keys(vmsConsumptionResponse.values));
      const datapoints = convertConsumptionsToRechartsPoint(vmsConsumptionResponse);
      setConsumptionPoints(datapoints);
    });
  }, [from, to]);

  return (
    <div>
      <div className="resource-consumption">
        From:
        <input type="date" onChange={(event) => setFrom(DateTime.fromJSDate(new Date(event.target.value)))} />
        To:
        <input type="date" onChange={(event) => setTo(DateTime.fromJSDate(new Date(event.target.value)))} />
        <LineChart width={500} height={300} data={consumptionPoints}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {/* <Legend /> */}
          {vmsNames.map((vmName) => <Line type="monotone" key={vmName} dataKey={vmName} stroke="#82ca9d" />)}
        </LineChart>
      </div>
    </div>
  );
}

export default ResourcesConsumption;
