import { IConsumptionsResponse } from 'ficus-models/lib/consumption';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import DatePicker from 'react-date-picker';
import {
  Legend,
  Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Header, Segment } from 'semantic-ui-react';
import { ChartsDatapoint } from './ChartsModels';
import { getVmsConsumption } from '../../../../requests/api/consumption';
import { ResourcesPageContext } from '../../ResourcesPageContext';
import './ResourcesConsumption.scss';

const convertConsumptionsToRechartsPoint = (consumptions: IConsumptionsResponse): ChartsDatapoint[] => {
  const datapoints: ChartsDatapoint[] = consumptions.timestamps.map((timestamp) => ({
    name: DateTime.fromSeconds(parseInt(timestamp, 10)).toLocaleString(DateTime.DATE_SHORT) || '',
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
  const [vmsIds, setVmsIds] = useState<string[]>([]);
  const [from, setFrom] = useState<DateTime>(DateTime.now().minus({ month: 1 }).startOf('day'));
  const [to, setTo] = useState<DateTime>(DateTime.now().endOf('day'));

  useEffect(() => {
    if (from.isValid && to.isValid) {
      getVmsConsumption(from, to).then((vmsConsumptionResponse) => {
        setVmsIds(Object.keys(vmsConsumptionResponse.values));
        const datapoints = convertConsumptionsToRechartsPoint(vmsConsumptionResponse);
        setConsumptionPoints(datapoints);
      });
    } else {
      setConsumptionPoints([]);
    }
  }, [from, to]);

  return (
    <ResourcesPageContext.Consumer>
      { ({ resourcesNames }) => (
        <Segment basic id="resource-consumption">
          <Header as="h2">Consumption</Header>
          <Header as="h3">Virtual Machines</Header>
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
              <Tooltip
                formatter={(value, vmId) => [
                  typeof value === 'number' ? value.toFixed(3) : value,
                  resourcesNames.vms?.[vmId] ?? vmId]}
              />
              <Legend formatter={(vmId) => resourcesNames.vms?.[vmId] ?? vmId} />
              {vmsIds.map((vmId) => <Line type="monotone" key={vmId} dataKey={vmId} />)}
            </LineChart>
          </ResponsiveContainer>
        </Segment>
      )}
    </ResourcesPageContext.Consumer>
  );
}

export default ResourcesConsumption;
