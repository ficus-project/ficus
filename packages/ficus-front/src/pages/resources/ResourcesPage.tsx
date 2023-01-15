import { Container } from 'semantic-ui-react';
import PageHeader from '../../components/PageHeader/PageHeader';

import './ResourcesPage.scss';
import ResourcesConsumption from './sections/ResourcesConsumption/ResourcesConsumption';
import ResourcesList from './sections/ResourcesList/ResourcesList';

function Resources() {
  return (
    <>
      <PageHeader title="Resources" subtitle="Take a look at your resources!" />
      <Container id="resources">
        <ResourcesList />
        <ResourcesConsumption />
      </Container>
    </>
  );
}

export default Resources;
