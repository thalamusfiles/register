import { observer } from 'mobx-react-lite';
import { Alert, Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useI18N } from '../../../../commons/i18';
import { getLinkTo } from '../../../../commons/route';
import { notify } from '../../../../components/Notification';
import { PersonPartnerCtrl, PersonPartnerProvider, usePersonPartnerStore } from './ctrl';

const PartnerPage: React.FC = () => {
  const __ = useI18N();
  const ctrl = new PersonPartnerCtrl();
  ctrl.notifyExeption = (ex: any) => {
    if (ex.response?.status === 404) {
      notify.danger(__('msg.error_404'));
    } else {
      notify.danger(ex.message);
    }
  };

  return (
    <PersonPartnerProvider value={ctrl}>
      <Alert variant="secondary" className="p-4">
        <h2>{__('person.partner.title')}</h2>
        <p>{__('person.partner.descriptions')}</p>

        <PartnerForm />
      </Alert>
      <PersonLegalResult />
    </PersonPartnerProvider>
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

const PartnerForm: React.FC = observer(() => {
  const ctrl = usePersonPartnerStore();
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
            <Form.Control id="document" onChange={ctrl.handleDocument} />
          </InputGroup>
        </Col>
        <Col xs="auto">
          <Button type="button" className="mb-2" onClick={ctrl.findDocument}>
            {__('action.search')}
          </Button>
        </Col>
      </Row>
    </Form>
  );
});

const PersonLegalResult: React.FC = observer(() => {
  const ctrl = usePersonPartnerStore();
  const __ = useI18N();
  return (
    <>
      <h2>{__('label.result')}</h2>
      {ctrl.response && <pre>{JSON.stringify(ctrl.response)}</pre>}
    </>
  );
});

export default PartnerPage;
export { PartnerBreadcrum };
