import { Alert, Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useI18N } from '../../../../commons/i18';
import { getLinkTo } from '../../../../commons/route';

const PartnerPage: React.FC = () => {
  const __ = useI18N();
  return (
    <>
      <Alert variant="secondary" className="p-4">
        <h2>{__('person.partner.title')}</h2>
        <p>{__('person.partner.descriptions')}</p>

        <PartnerForm />
      </Alert>
      <PersonLegalResult />
    </>
  );
};

const PartnerBreadcrum: React.FC = () => {
  const __ = useI18N();
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">{__('menu.home')}</Breadcrumb.Item>
      <Breadcrumb.Item href={getLinkTo('persons')}>{__('menu.persons')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{__('menu.person_legal')}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

const PartnerForm: React.FC = () => {
  const __ = useI18N();
  return (
    <Form>
      <Row className="align-items-center">
        <Col xs="auto">
          <Form.Label htmlFor="country" visuallyHidden>
            {__('country.brazil')}
          </Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text>{__('label.country')}</InputGroup.Text>
            <Form.Control id="country" placeholder={__('country.brazil')} disabled />
          </InputGroup>
        </Col>
        <Col xs="auto">
          <Form.Label htmlFor="document" visuallyHidden>
            {__('label.partner_doc')}
          </Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text>{__('label.partner_doc')}</InputGroup.Text>
            <Form.Control id="document" />
          </InputGroup>
        </Col>
        <Col xs="auto">
          <Button type="submit" className="mb-2">
            {__('action.search')}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const PersonLegalResult: React.FC = () => {
  const __ = useI18N();
  return (
    <>
      <h2>{__('label.result')}</h2>
      <pre>{JSON.stringify({ ihaaa: 'asdasd' })}</pre>
    </>
  );
};

export default PartnerPage;
export { PartnerBreadcrum };
