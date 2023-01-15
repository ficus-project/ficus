import { IVirtualMachineResourceResponse } from 'ficus-models/lib/resources';
import { useEffect, useState } from 'react';
import { Container, Grid } from 'semantic-ui-react';
import PageHeader from '../../components/PageHeader/PageHeader';
import { getVmsResponse } from '../../requests/api/resources';
import VirtualMachine from './components/VirtualMachine/VirtualMachine';

import './Resources.scss';

function Resources() {
  const [vms, setVms] = useState<IVirtualMachineResourceResponse>({});

  useEffect(() => {
    getVmsResponse().then((vmsResponse) => {
      setVms(vmsResponse);
    });
  }, []);

  return (
    <>
      <PageHeader title="Resources" subtitle="Take a look at your resources!" />
      <Container id="resources">
        <Grid className="type">
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
      </Container>
    </>
  );
}

export default Resources;
