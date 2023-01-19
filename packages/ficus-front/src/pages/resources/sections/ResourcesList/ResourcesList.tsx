import { IVirtualMachineResourceResponse } from 'ficus-models/lib/resources';
import { useContext, useEffect, useState } from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { getExistingVms } from '../../../../requests/api/resources';
import FakeVirtualMachine from '../../components/VirtualMachine/FakeVirtualMachine';
import VirtualMachine from '../../components/VirtualMachine/VirtualMachine';
import { ResourcesPageContext } from '../../ResourcesPageContext';

import './ResourcesList.scss';

function ResourcesList() {
  const [areVmsLoaded, setAreVmsLoaded] = useState<boolean>(false);
  const [vms, setVms] = useState<IVirtualMachineResourceResponse>({});
  const { resourcesNames, setResourcesNames } = useContext(ResourcesPageContext);

  useEffect(() => {
    getExistingVms().then((vmsResponse) => {
      setVms(vmsResponse);
      setResourcesNames({
        ...resourcesNames,
        vms: Object.entries(vmsResponse).reduce((acc, [id, value]) => ({ ...acc, [id]: value.name ?? id }), {}),
      });
      setAreVmsLoaded(true);
    });
  }, []);

  return (
    <Segment basic className="resource-list">
      <Header as="h2">Inventory</Header>
      <Header as="h3">Virtual Machines</Header>
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
