import { IVirtualMachineResourceResponse } from 'ficus-models/lib/resources';
import { useEffect, useState } from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { getExistingVms } from '../../../../requests/api/resources';
import FakeVirtualMachine from '../../components/VirtualMachine/FakeVirtualMachine';
import VirtualMachine from '../../components/VirtualMachine/VirtualMachine';

import './ResourcesList.scss';

function ResourcesList() {
  const [areVmsLoaded, setAreVmsLoaded] = useState<boolean>(false);
  const [vms, setVms] = useState<IVirtualMachineResourceResponse>({});

  useEffect(() => {
    getExistingVms().then((vmsResponse) => {
      setVms(vmsResponse);
      setAreVmsLoaded(true);
    });
  }, []);

  return (
    <Segment basic className="resource-list">
      <Header as="h2">Virtual Machines List</Header>
      <Grid>
        {areVmsLoaded ? (
          Object.keys(vms).map((vmKey) => (
            <Grid.Column key={vmKey} computer={4} tablet={8} mobile={16}>
              <VirtualMachine
                id={vmKey}
                name={vms[vmKey].name}
                isRunning={vms[vmKey].isRunning}
                cpuThreads={vms[vmKey].cpuThreads}
                memoryInMb={vms[vmKey].memoryInMb}
              />
            </Grid.Column>
          ))
        ) : (
          <>
            {new Array(4).fill(null).map((_, index) => (
              <Grid.Column key={index} computer={4} tablet={8} mobile={16}>
                <FakeVirtualMachine />
              </Grid.Column>
            ))}
          </>
        )}
      </Grid>
    </Segment>
  );
}

export default ResourcesList;
