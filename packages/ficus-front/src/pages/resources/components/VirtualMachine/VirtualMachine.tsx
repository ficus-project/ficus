import { Card, Label, SemanticCOLORS } from 'semantic-ui-react';
import './VirtualMachine.scss';

interface Props {
  name?: string,
  id: string,
  isRunning?: boolean,
  cpuThreads?: number,
  memoryInMb?: number,
}

const getLabelColorForState = (state?: boolean): SemanticCOLORS => {
  if (state === true) return 'green';
  if (state === false) return 'red';
  return 'grey';
};

function VirtualMachine({
  name = undefined, id, isRunning = undefined, cpuThreads = undefined, memoryInMb = undefined,
}: Props) {
  const runningStateColor: SemanticCOLORS = getLabelColorForState(isRunning);

  return (
    <Card id="virtual-machine">
      <Card.Content>
        <Label circular color={runningStateColor} empty className="running-state" />
        <Card.Header>{name ?? id}</Card.Header>
        <Card.Meta className="identifier">{name ? id : ''}</Card.Meta>

        <Card.Description>
          <ul>
            {cpuThreads && <li>{`${cpuThreads} CPU threads`}</li>}
            {memoryInMb && <li>{`${memoryInMb} Mb memory`}</li>}
          </ul>
        </Card.Description>
      </Card.Content>
    </Card>
  );
}

export default VirtualMachine;
