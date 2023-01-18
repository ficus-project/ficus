import { Placeholder, Segment } from 'semantic-ui-react';
import './VirtualMachine.scss';

function FakeVirtualMachine() {
  return (
    <Segment raised id="virtual-machine">
      <Placeholder>
        <Placeholder.Header>
          <Placeholder.Line length="long" />
          <Placeholder.Line length="medium" />
        </Placeholder.Header>
        <Placeholder.Paragraph>
          <Placeholder.Line length="long" />
          <Placeholder.Line length="long" />
        </Placeholder.Paragraph>
      </Placeholder>
    </Segment>
  );
}

export default FakeVirtualMachine;
