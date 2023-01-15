import { ReactNode } from 'react';
import {
  Menu, MenuItem, Sidebar, SidebarPushable, SidebarPusher,
} from 'semantic-ui-react';
import './NavigationSidebar.scss';

function NavigationSidebar({ children }: { children: ReactNode }) {
  return (
    <SidebarPushable id="navigation-sidebar">
      <Sidebar visible animation="push" width="thin">
        <Menu vertical className="menu">
          <MenuItem disabled>Ficuses</MenuItem>
          <MenuItem href="/resources">Resources</MenuItem>
          <MenuItem disabled>Impact</MenuItem>
        </Menu>
      </Sidebar>
      <SidebarPusher>
        {children}
      </SidebarPusher>
    </SidebarPushable>
  );
}

export default NavigationSidebar;