import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PropsWithChildren } from 'react';
import Card from 'react-bootstrap/Card';

type TCardProps = PropsWithChildren<{
  title: string;
  subtitle: string;
  variant?: string;
  faicon?: any;
}>;

const TCard: React.FC<TCardProps> = (props: TCardProps) => {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Header>
        <Card.Title className={"float-end text-" + props.variant}>{props.faicon && <FontAwesomeIcon icon={props.faicon} size="2x" />}</Card.Title>
        <Card.Title>{props.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{props.subtitle}</Card.Subtitle>
      </Card.Header>
      {props.children}
    </Card>
  );
};

export default TCard;
