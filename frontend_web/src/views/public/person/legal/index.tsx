import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Alert, Badge, Button, ButtonGroup, Card, Col, Form, InputGroup, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useParams } from 'react-router-dom';
import { useI18N } from '../../../../commons/i18';
import { getLinkTo } from '../../../../commons/route';
import { PersonLegalCtrl, PersonLegalProvider, usePersonLegalStore } from './ctrl';
import { Helmet } from 'react-helmet';
import SpinnerLoader from '../../../../components/Loader';
import { brGovStatusCodeActive } from '../../../../commons/consts';

const ctrl = new PersonLegalCtrl();
const PersonLegalPage: React.FC = () => {
  const __ = useI18N();
  const { document } = useParams();
  ctrl.__ = __;

  useEffect(() => {
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
      <HeadTitle />

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

const HeadTitle: React.FC = observer(() => {
  const __ = useI18N();
  const ctrl = usePersonLegalStore();
  const data = ctrl.response?.brGovDados;

  return (
    <>
      {data?.name && <Helmet title={data.name as string} />}
      {!data?.name && (
        <Helmet title={__('person.legal.title')}>
          <meta name="description" content={__('person.legal.meta')} />
        </Helmet>
      )}
    </>
  );
});

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
      {!!ctrl.erroMessages?.length && (
        <Alert variant="danger">
          {ctrl.erroMessages.map((msg) => (
            <>
              {__(msg)} <br />
            </>
          ))}
        </Alert>
      )}

      <Row className="align-items-center">
        <Col md={4}>
          <Form.Label htmlFor="country" visuallyHidden>
            {__('country.brazil')}
          </Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text>{__('label.country')}</InputGroup.Text>
            <Form.Control id="country" placeholder={__('country.brazil')} disabled isValid={!!ctrl.erroMessages.length} />
            <Form.Control.Feedback type="valid">{__('label.valid')}</Form.Control.Feedback>
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Label htmlFor="document" visuallyHidden>
            {__('label.business_doc')}
          </Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text>{__('label.business_doc')}</InputGroup.Text>
            <Form.Control id="document" value={ctrl.document} onChange={ctrl.handleDocument} isInvalid={!!ctrl.erros?.document} />
            <Form.Control.Feedback type="invalid">{ctrl.erros?.document?.map(__)}</Form.Control.Feedback>
          </InputGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <ButtonGroup className="float-end">
            <Button type="button" className="mb-2" disabled={!!ctrl.waiting} onClick={ctrl.findDocument}>
              {__('action.search')}
            </Button>
            <Button type="button" className="mb-2" variant="outline-primary" disabled={!!ctrl.waiting} onClick={ctrl.findDocumentRandom}>
              {__('action.random_search')}
            </Button>
          </ButtonGroup>

          <Button type="button" className="mb-2" variant="outline-secondary" disabled={!!ctrl.waiting} onClick={ctrl.handleClear}>
            {__('action.clearform')}
          </Button>
        </Col>
      </Row>
    </Form>
  );
});

const PersonPrettyResult: React.FC = observer(() => {
  const ctrl = usePersonLegalStore();
  const __ = useI18N();

  const data = ctrl.response?.brGovDados || {};
  return (
    <>
      <h2>
        {__('label.result')} <SpinnerLoader show={!!ctrl.waiting} />
      </h2>

      {ctrl.waiting === null && <p>{__('msg.enter_filter')}</p>}
      {ctrl.waiting === false && !ctrl.response && <p>{__('msg.register_not_found')}</p>}
      {ctrl.response && (
        <Form>
          <Badge bg={data.statusCode === brGovStatusCodeActive ? 'success' : 'danger'}>{data.status || ''}</Badge>
          &nbsp;
          {data.naturePerson && <Badge>{__('label.naturePerson')}</Badge>}
          &nbsp;
          {data.naturePerson && <ProtectedInfoBadge __={__} />}
          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Tipo de documento
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly value={(data.documentType as string)?.toLocaleUpperCase()} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Documento
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly value={data.document || ''} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Nome fantasia
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly value={data.fantasyName || ''} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Razão Social
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly value={data.name || ''} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Natureza jurídica
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly value={`${data.natureCode || ''} - ${data.nature || ''}`} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Situação
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly value={`${data.statusCode || ''} - ${data.status || ''}`} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Motivo:
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly value={data.reason} />
            </Col>
          </Form.Group>
          <h3>Atividade</h3>
          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Principal
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly value={`${data.mainActivity || ''} - ${data.mainActivityDescription || ''}`} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Secundárias
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly value={(data.otherActivities as Array<string>)?.join(', ')} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="4">
              MEI:
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly value={data.MEI.is ? 'Sim' : 'Não'} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Simples:
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly value={data.simples.is ? 'Sim' : 'Não'} />
            </Col>
          </Form.Group>
          <h3>Contato</h3>
          <Form.Group as={Row}>
            <Form.Label column sm="4">
              E-mail
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly value={data.email || ''} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Telefone
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly value={data.phone || ''} />
            </Col>
          </Form.Group>
          <h3>Endereço</h3>
          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Estado
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly value={data.stateCode || ''} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Cidade
            </Form.Label>
            <Col sm="8">
              <Form.Control plaintext readOnly value={data.cityName || ''} />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="4">
              Endereço
            </Form.Label>
            <Col sm="8">
              <Form.Control
                plaintext
                readOnly
                value={`${data.zipcode || ''} - ${data.publicPlaceCode || ''} ${data.publicPlace || ''} ${data.number || ''} ${
                  data.complement || ''
                } ${data.neighborhood || ''}`}
              />
            </Col>
          </Form.Group>
        </Form>
      )}
    </>
  );
});

const ProtectedInfoBadge: React.FC<{ __: Function }> = ({ __ }: any) => {
  return (
    <OverlayTrigger trigger="click" placement="right" overlay={ProtectedInfoPopover}>
      <Badge bg="secondary">{__('label.protectedInfo')}</Badge>
    </OverlayTrigger>
  );
};

const ProtectedInfoPopover = (
  <Popover>
    <Popover.Header as="h3">Informação protegida</Popover.Header>
    <Popover.Body>O Telefone e complemento dos endereços das pessoas físicas não estão disponíveis via API.</Popover.Body>
  </Popover>
);

const PersonLegalResult: React.FC = observer(() => {
  const ctrl = usePersonLegalStore();
  const __ = useI18N();

  return (
    <>
      <h2>{__('label.json_result')}</h2>
      <Card bg="dark" text="light">
        <Card.Body>
          {ctrl.waiting === null && <p>{__('msg.enter_filter')}</p>}
          {ctrl.waiting === false && !ctrl.response && <p>{__('msg.register_not_found')}</p>}
          {ctrl.response && <pre>{JSON.stringify(ctrl.response, null, 2)}</pre>}
        </Card.Body>
      </Card>
    </>
  );
});

export default PersonLegalPage;
export { PersonLegalBreadcrum };
