import { IVirtualMachineResourceResponse } from 'ficus-models/lib/resources';
import { useEffect, useState } from 'react';
import { Grid } from 'semantic-ui-react';
import { getExistingVms } from '../../../../requests/api/resources';
import VirtualMachine from '../../components/VirtualMachine/VirtualMachine';

import './ResourcesList.scss';

function ResourcesList() {
  const [vms, setVms] = useState<IVirtualMachineResourceResponse>({});

  useEffect(() => {
    getExistingVms().then((vmsResponse) => {
      setVms(vmsResponse);
    });
  }, []);

  return (
    <Grid className="resource-list">
      {Object.keys(vms).map((vmKey) => (
        <Grid.Column key={vmKey} width={3}>
          <VirtualMachine
            id={vmKey}
            name={vms[vmKey].name}
            isRunning={vms[vmKey].isRunning}
            cpuThreads={vms[vmKey].cpuThreads}
            memoryInMb={vms[vmKey].memoryInMb}
          />
        </Grid.Column>
      ))}
    </Grid>
  );
}

export default ResourcesList;
