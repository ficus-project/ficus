import { Container, Icon, Menu } from 'semantic-ui-react';
import './AppHeader.scss';

function AppHeader() {
  return (
    <div id="app-header">
      <Container>
        <Menu borderless size="massive" className="menu">
          <Menu.Item header className="menu-item">FICUS</Menu.Item>
          <Menu.Item><Icon name="tree" className="menu-item menu-item--icon" /></Menu.Item>
          <Menu.Item name="Resources" href="/resources" className="menu-item" />
          <Menu.Item name="Impact" disabled className="menu-item" />
        </Menu>
      </Container>
    </div>
  );
}

export default AppHeader;
