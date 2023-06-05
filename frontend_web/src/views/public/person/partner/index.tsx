import { observer } from 'mobx-react-lite';
import { Alert, Button, ButtonGroup, Card, Col, Form, InputGroup, Row, Table } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useI18N } from '../../../../commons/i18';
import { getLinkTo } from '../../../../commons/route';
import { notify } from '../../../../components/Notification';
import { PersonPartnerCtrl, PersonPartnerProvider, usePersonPartnerStore } from './ctrl';

const PartnerPage: React.FC = () => {
  const __ = useI18N();
  const ctrl = new PersonPartnerCtrl();
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
    <PersonPartnerProvider value={ctrl}>
      <Alert variant="secondary" className="p-4">
        <h2>{__('person.partner.title')}</h2>
        <p>{__('person.partner.description')}</p>

        <PartnerForm />
      </Alert>
      <PartnerPrettyResult />
      <PartnerResult />
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
            <Form.Control id="document" value={ctrl.document} onChange={ctrl.handleDocument} />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <ButtonGroup className="float-end">
            <Button type="button" className="mb-2" onClick={ctrl.findDocument}>
              {__('action.search')}
            </Button>
            <Button
              type="button"
              className="mb-2"
              variant="outline-primary"
              onClick={() => {
                ctrl.findDocumentRandom();
              }}
            >
              {__('action.test')}
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Form>
  );
});

const PartnerPrettyResult: React.FC = observer(() => {
  const ctrl = usePersonPartnerStore();
  const __ = useI18N();
  return (
    <>
      <h2>{__('label.result')}</h2>
      <Table>
        <thead>
          <tr>
            <td>Sócio Doc</td>
            <td>Sócio</td>
            <td>Representante Doc</td>
            <td>Representante</td>
            <td>Empresa Doc</td>
            <td>Empresa</td>
          </tr>
        </thead>
        <tbody>
          {!ctrl.wanted && (
            <tr>
              <td colSpan={6}>{__('msg.enter_filter')}</td>
            </tr>
          )}
          {ctrl.wanted && !ctrl.response && (
            <tr>
              <td colSpan={6}>{__('msg.register_not_found')}</td>
            </tr>
          )}
          {ctrl.response &&
            ctrl.response.map((resp, idx) => (
              <tr key={idx}>
                <td>{resp.partner}</td>
                <td>{resp.partnerDoc}</td>
                <td>{resp.representativeName ? resp.representativeDoc : null}</td>
                <td>{resp.representativeName}</td>
                <td>{resp.extra_key}</td>
                <td>{resp.name}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
});

const PartnerResult: React.FC = observer(() => {
  const ctrl = usePersonPartnerStore();
  const __ = useI18N();
  return (
    <>
      <h2>{__('label.json_result')}</h2>
      <Card bg="dark" text="light">
        <Card.Body>
          {!ctrl.wanted && <p>{__('msg.enter_filter')}</p>}
          {ctrl.wanted && !ctrl.response && <p>{__('msg.register_not_found')}</p>}
          {ctrl.response && <pre>{JSON.stringify(ctrl.response, null, 2)}</pre>}
        </Card.Body>
      </Card>
    </>
  );
});

export default PartnerPage;
export { PartnerBreadcrum };
