import { observer } from 'mobx-react-lite';
import { Alert, Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useI18N } from '../../../../commons/i18';
import { getLinkTo } from '../../../../commons/route';
import { notify } from '../../../../components/Notification';
import { PersonLegalCtrl, PersonLegalProvider, usePersonLegalStore } from './ctrl';

const PersonLegalPage: React.FC = () => {
  const __ = useI18N();
  const ctrl = new PersonLegalCtrl();
  ctrl.notifyExeption = (ex: any) => {
    const status = ex.response?.status;
    if ([404].includes(status)) {
      notify.warn(__(`msg.error_${status}`));
    } else if ([400, 500].includes(status)) {
      notify.danger(__(`msg.error_${status}`));
    } else {
      notify.danger(ex.message);
    }
  };

  return (
    <PersonLegalProvider value={ctrl}>
      <Alert variant="secondary" className="p-4">
        <h2>{__('person.legal.title')}</h2>
        <p>{__('person.legal.description')}</p>

        <PersonLegaForm />
      </Alert>
      <PersonLegalResult />
    </PersonLegalProvider>
  );
};

const PersonLegalBreadcrum: React.FC = () => {
  const __ = useI18N();
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">{__('menu.home')}</Breadcrumb.Item>
      <Breadcrumb.Item href={getLinkTo('persons')}>{__('menu.persons')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{__('menu.person_legal')}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

const PersonLegaForm: React.FC = observer(() => {
  const ctrl = usePersonLegalStore();
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
            {__('label.business_doc')}
          </Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text>{__('label.business_doc')}</InputGroup.Text>
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
  const ctrl = usePersonLegalStore();
  const __ = useI18N();
  return (
    <>
      <h2>{__('label.result')}</h2>
      {!ctrl.wanted && <p>{__('msg.enter_filter')}</p>}
      {ctrl.wanted && !ctrl.response && <p>{__('msg.register_not_found')}</p>}
      {ctrl.response && <pre>{JSON.stringify(ctrl.response)}</pre>}
    </>
  );
});

export default PersonLegalPage;
export { PersonLegalBreadcrum };
