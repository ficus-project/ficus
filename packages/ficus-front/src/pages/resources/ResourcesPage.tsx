import { useMemo, useState } from 'react';
import { Container, Divider } from 'semantic-ui-react';
import PageHeader from '../../components/PageHeader/PageHeader';

import './ResourcesPage.scss';
import { ResourcesPageContext, IResourcesNames } from './ResourcesPageContext';
import ResourcesConsumption from './sections/ResourcesConsumption/ResourcesConsumption';
import ResourcesList from './sections/ResourcesList/ResourcesList';

function Resources() {
  const [resourcesNames, setResourcesNames] = useState<IResourcesNames>({});

  return (
    <ResourcesPageContext.Provider value={useMemo(() => ({ resourcesNames, setResourcesNames }), [resourcesNames, setResourcesNames])}>
      <PageHeader title="Resources" subtitle="Take a look at your resources!" />
      <Container id="resources">
        <ResourcesList />
        <Divider />
        <ResourcesConsumption />
      </Container>
    </ResourcesPageContext.Provider>
  );
}

export default Resources;
