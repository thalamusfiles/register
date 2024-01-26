import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Alert, Badge, Button, ButtonGroup, Card, Col, Form, InputGroup, Nav, OverlayTrigger, Popover, Row, Table } from 'react-bootstrap';
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
  const [tab, setTab] = useState('formated' as string | null);
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
      <Nav variant="tabs" defaultActiveKey="formated" onSelect={setTab}>
        <Nav.Item>
          <Nav.Link eventKey="formated">{__('label.formated')}</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="json">{__('label.json')}</Nav.Link>
        </Nav.Item>
      </Nav>
      <br />

      {tab === 'formated' && <PersonPrettyResult />}
      {tab === 'json' && <PersonLegalResult />}
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
        <Col xl={4}>
          <Form.Label htmlFor="country" visuallyHidden>
            {__('country.brazil')}
          </Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text>{__('label.country')}</InputGroup.Text>
            <Form.Control id="country" placeholder={__('country.brazil')} disabled isValid={!!ctrl.erroMessages.length} />
            <Form.Control.Feedback type="valid">{__('label.valid')}</Form.Control.Feedback>
          </InputGroup>
        </Col>
        <Col xl={4}>
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
        <Card>
          <Card.Body className="pt-0">
            <Form>
              <Badge bg={data.statusCode === brGovStatusCodeActive ? 'success' : 'danger'}>{data.status || ''}</Badge>
              &nbsp;
              {data.naturePerson && <Badge>{__('label.naturePerson')}</Badge>}
              &nbsp;
              {data.naturePerson && <ProtectedInfoBadge __={__} />}
              <Row>
                <Form.Group as={Col} md={3}>
                  <Form.Label>Documento</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>{(data.documentType as string)?.toLocaleUpperCase()}</InputGroup.Text>
                    <Form.Control readOnly value={data.document || ''} />
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md={3}>
                  <Form.Label>Nome fantasia</Form.Label>
                  <Form.Control readOnly value={data.fantasyName || ''} />
                </Form.Group>
                <Form.Group as={Col} md={6}>
                  <Form.Label>Razão Social</Form.Label>
                  <Form.Control readOnly value={data.name || ''} />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md={3}>
                  <Form.Label>Natureza jurídica</Form.Label>
                  <Form.Control readOnly value={`${data.natureCode || ''} - ${data.nature || ''}`} />
                </Form.Group>
                <Form.Group as={Col} md={3}>
                  <Form.Label>Situação</Form.Label>
                  <Form.Control readOnly value={`${data.statusCode || ''} - ${data.status || ''}`} />
                </Form.Group>
                <Form.Group as={Col} md={6}>
                  <Form.Label>Motivo:</Form.Label>
                  <Form.Control readOnly value={data.reason} />
                </Form.Group>
              </Row>
              <h5 className="mt-2">Atividades</h5>
              <Row>
                <Form.Group as={Col} md={6}>
                  <Form.Label>Principal</Form.Label>
                  <Form.Control readOnly value={`${data.mainActivity || ''} - ${data.mainActivityDescription || ''}`} />
                </Form.Group>
                <Form.Group as={Col} md={6}>
                  <Form.Label>Secundárias</Form.Label>
                  {data.otherActivities.map((activity: string, idx: number) => (
                    <Form.Control readOnly value={activity} key={idx} />
                  ))}
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>MEI:</Form.Label>
                  <Form.Control readOnly value={data.MEI?.is ? 'Sim' : 'Não'} />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Simples:</Form.Label>
                  <Form.Control readOnly value={data.simples?.is ? 'Sim' : 'Não'} />
                </Form.Group>
              </Row>
              <h5 className="mt-2">Contato</h5>
              <Row>
                <Form.Group as={Col}>
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control readOnly value={data.email?.join(', ') || ''} />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control readOnly value={data.phone?.join(', ') || ''} />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Fax</Form.Label>
                  <Form.Control readOnly value={data.fax?.join(', ') || ''} />
                </Form.Group>
              </Row>
              <h5 className="mt-2">Endereço</h5>
              <Row>
                <Form.Group as={Col} xs={6} md={2}>
                  <Form.Label>Estado</Form.Label>
                  <Form.Control readOnly value={data.stateCode || ''} />
                </Form.Group>
                <Form.Group as={Col} xs={6} md={2}>
                  <Form.Label>Cidade</Form.Label>
                  <Form.Control readOnly value={data.cityName || ''} />
                </Form.Group>
                <Form.Group as={Col} md={8}>
                  <Form.Label>Endereço</Form.Label>
                  <Form.Control
                    readOnly
                    value={`${data.zipcode || ''} - ${data.publicPlaceCode || ''} ${data.publicPlace || ''} ${data.number || ''} ${
                      data.complement || ''
                    } ${data.neighborhood || ''}`}
                  />
                </Form.Group>
              </Row>
              <h5 className="mt-2">Sócios</h5>
              <Table striped responsive>
                <thead>
                  <tr>
                    <th>Documento</th>
                    <th>Sócio</th>
                    <th>Responsável</th>
                    <th>Responsável Documento</th>
                  </tr>
                </thead>
                <tbody>
                  {data.partners.map((partner: any, idx: number) => (
                    <tr>
                      <td>{partner.partner}</td>
                      <td>{partner.partnerDoc}</td>
                      <td>{partner.representativeName}</td>
                      <td>{partner.representativeDoc}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Form>
          </Card.Body>
        </Card>
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
