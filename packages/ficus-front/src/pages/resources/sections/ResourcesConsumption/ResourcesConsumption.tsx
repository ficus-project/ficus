import { IConsumptionsResponse } from 'ficus-models/lib/consumption';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import DatePicker from 'react-date-picker';
import {
  Legend,
  Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Header, Segment } from 'semantic-ui-react';
import { ChartsDatapoint } from '../../../../models/ChartsModels';
import { getVmsConsumption } from '../../../../requests/api/consumption';
import './ResourcesConsumption.scss';

const convertConsumptionsToRechartsPoint = (consumptions: IConsumptionsResponse): ChartsDatapoint[] => {
  const datapoints: ChartsDatapoint[] = consumptions.timestamps.map((timestamp) => ({
    name: DateTime.fromSeconds(parseInt(timestamp, 10)).toLocaleString(DateTime.DATETIME_SHORT) || '',
  }));

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
  const [from, setFrom] = useState<DateTime>(DateTime.now().minus({ days: 7 }).startOf('day'));
  const [to, setTo] = useState<DateTime>(DateTime.now().endOf('day'));

  useEffect(() => {
    if (from.isValid && to.isValid) {
      getVmsConsumption(from, to).then((vmsConsumptionResponse) => {
        setVmsNames(Object.keys(vmsConsumptionResponse.values));
        const datapoints = convertConsumptionsToRechartsPoint(vmsConsumptionResponse);
        setConsumptionPoints(datapoints);
      });
    } else {
      setConsumptionPoints([]);
    }
  }, [from, to]);

  return (
    <Segment basic id="resource-consumption">
      <Header as="h2">Virtual Machines Consumption</Header>
      <div className="date-pickers">
        <span className="label">From:</span>
        <DatePicker
          value={from.isValid ? from.toJSDate() : null}
          onChange={(date: Date) => setFrom(DateTime.fromJSDate(date))}
          className="picker"
        />
        <span className="label">To:</span>
        <DatePicker
          value={to.isValid ? to.toJSDate() : null}
          onChange={(date: Date) => setTo(DateTime.fromJSDate(date))}
          className="picker"
        />
      </div>
      <ResponsiveContainer width="100%" height={300} className="chart">
        <LineChart width={500} height={300} data={consumptionPoints}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {vmsNames.map((vmName) => <Line type="monotone" key={vmName} dataKey={vmName} />)}
        </LineChart>
      </ResponsiveContainer>
    </Segment>
  );
}

export default ResourcesConsumption;
