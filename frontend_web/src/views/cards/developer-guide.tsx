import { Button, Card, Col, Row } from 'react-bootstrap';
import { IconsDef } from '../../commons/consts';
import { useI18N } from '../../commons/i18';
import { historyPush } from '../../commons/route';
import TCard from '../../components/Card/card';
import * as json from '../../../package.json';

const { docUrl } = json as any;

const DeveloperGuide: React.FC = () => {
  const __ = useI18N();
  return (
    <>
      <h1>{__('card.developer_guide')}</h1>
      <p>{__('card.developer_guide_description')}</p>
      <Row>
        <Col className="d-flex justify-content-center" xll={6}>
          <TCard title={__('card.docs')} subtitle={__('card.docs_subtitle')} faicon={IconsDef.docs} bg="info" text="white">
            <Card.Body>
              <Card.Text>{__('card.docs_description')}</Card.Text>
              <Button size="sm" onClick={() => historyPush(docUrl, { open: true })} variant="secondary">
                {__('action.access')}
              </Button>
            </Card.Body>
          </TCard>
        </Col>
        <Col className="d-flex justify-content-center" xll={6}>
          <TCard title={__('card.swagger')} subtitle={__('card.swagger_subtitle')} faicon={IconsDef.swagger} border="info">
            <Card.Body>
              <Card.Text>{__('card.swagger_description')}</Card.Text>
              <Button size="sm" onClick={() => historyPush('/swagger', { open: true })} variant="outline-info">
                {__('action.access')}
              </Button>
            </Card.Body>
          </TCard>
        </Col>
      </Row>
    </>
  );
};

export default DeveloperGuide;
