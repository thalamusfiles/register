import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Alert, Button, ButtonGroup, Card, Col, Form, InputGroup, Nav, Row, Table } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link, useSearchParams } from 'react-router-dom';
import { useI18N } from '../../../../commons/i18';
import { getLinkTo } from '../../../../commons/route';
import { notify } from '../../../../components/Notification';
import { PersonPartnerCtrl, PersonPartnerProvider, usePersonPartnerStore } from './ctrl';
import { Helmet } from 'react-helmet';
import SpinnerLoader from '../../../../components/Loader';
import classNames from 'classnames';

const ctrl = new PersonPartnerCtrl();
const PartnerPage: React.FC = () => {
  const __ = useI18N();
  const [tab, setTab] = useState('formated' as string | null);
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
    <PersonPartnerProvider value={ctrl}>
      <Helmet title={__('person.partner.title')}>
        <meta name="description" content={__('person.partner.meta')} />
      </Helmet>

      <Alert variant="secondary" className="p-4">
        <h2>{__('person.partner.title')}</h2>
        <p>{__('person.partner.description')}</p>

        <PartnerForm />
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

      {tab === 'formated' && <PartnerPrettyResult />}
      {tab === 'json' && <PartnerResult />}
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
            {__('label.partner_doc')}
          </Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text>{__('label.partner_doc')}</InputGroup.Text>
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

const PartnerPrettyResult: React.FC = observer(() => {
  const ctrl = usePersonPartnerStore();
  const __ = useI18N();

  return (
    <>
      <h2>
        {__('label.result')} <SpinnerLoader show={!!ctrl.waiting} />
      </h2>
      <Table className={classNames({ blur: ctrl.waiting })}>
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
          {ctrl.waiting === null && (
            <tr>
              <td colSpan={6}>{__('msg.enter_filter')}</td>
            </tr>
          )}
          {ctrl.waiting === false && !ctrl.response && (
            <tr>
              <td colSpan={6}>{__('msg.register_not_found')}</td>
            </tr>
          )}
          {ctrl.response &&
            ctrl.response.map((resp, idx) => (
              <tr key={idx}>
                <td>{resp.partnerDoc}</td>
                <td>{resp.partner}</td>
                <td>{resp.representativeName ? resp.representativeDoc : null}</td>
                <td>{resp.representativeName}</td>
                <td>
                  <Link to="#" onClick={(e) => ctrl.handleOpenPersonLegal(e, resp.document)} style={{ whiteSpace: 'nowrap' }}>
                    {resp.document}
                  </Link>
                </td>
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
          {ctrl.waiting === null && <p>{__('msg.enter_filter')}</p>}
          {ctrl.waiting === false && !ctrl.response && <p>{__('msg.register_not_found')}</p>}
          {ctrl.response && <pre>{JSON.stringify(ctrl.response, null, 2)}</pre>}
        </Card.Body>
      </Card>
    </>
  );
});

export default PartnerPage;
export { PartnerBreadcrum };
