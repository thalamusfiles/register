import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Alert, Button, ButtonGroup, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useSearchParams } from 'react-router-dom';
import { useI18N } from '../../../../commons/i18';
import { getLinkTo } from '../../../../commons/route';
import { notify } from '../../../../components/Notification';
import { PersonLegalCtrl, PersonLegalProvider, usePersonLegalStore } from './ctrl';

const ctrl = new PersonLegalCtrl();
const PersonLegalPage: React.FC = () => {
  const __ = useI18N();
  const [searchParams] = useSearchParams();

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

  useEffect(() => {
    const document = searchParams.get('document') as string;
    if (ctrl.document !== document) {
      ctrl.handleDocument({ target: { value: document || '' } });
      if (ctrl.document) {
        ctrl.findDocument();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctrl]);

  return (
    <PersonLegalProvider value={ctrl}>
      <Alert variant="secondary" className="p-4">
        <h2>{__('person.legal.title')}</h2>
        <p>{__('person.legal.description')}</p>

        <PersonLegaForm />
      </Alert>

      <Row>
        <Col md={6}>
          <PersonPrettyResult />
        </Col>
        <Col md={6}>
          <PersonLegalResult />
        </Col>
      </Row>
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
              {__('action.random_search')}
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Form>
  );
});

const PersonPrettyResult: React.FC = observer(() => {
  const ctrl = usePersonLegalStore();
  const __ = useI18N();

  const data = ctrl.response?.brGovDados;
  return (
    <>
      <h2>{__('label.result')}</h2>
      {!ctrl.wanted && <p>{__('msg.enter_filter')}</p>}
      {ctrl.wanted && !ctrl.response && <p>{__('msg.register_not_found')}</p>}
      {ctrl.response && (
        <Form>
          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Tipo de documento
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly defaultValue={data?.documentType} />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Documento
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly defaultValue={data?.document} />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Nome
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly defaultValue={data?.name} />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Nome fantasia
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly defaultValue={data?.fantasyName} />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Código tipo <br />
              Código atividade
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly defaultValue={data?.mainActivity} />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Tipo de empresa <br />
              Atividade principal
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly defaultValue={data?.mainActivityDescription} />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm="4">
              E-mail
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly defaultValue={data?.email} />
            </Col>
          </Form.Group>
        </Form>
      )}
    </>
  );
});

const PersonLegalResult: React.FC = observer(() => {
  const ctrl = usePersonLegalStore();
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

export default PersonLegalPage;
export { PersonLegalBreadcrum };
