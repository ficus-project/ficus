import { ReactNode } from 'react';
import { Container } from 'semantic-ui-react';
import './PageHeader.scss';

interface Props {
  title: string,
  subtitle?: string,
  fluid?: boolean,
  children?: ReactNode
}

function PageHeader({
  title, subtitle = '', fluid = false, children = '',
}: Props) {
  return (
    <div id="page-header">
      <Container fluid={fluid}>
        <h1 className="title">{title}</h1>
        <h2 className="subtitle">{subtitle}</h2>
        {children}
      </Container>
    </div>
  );
}

export default PageHeader;
