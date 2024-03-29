import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Alert, Button, ButtonGroup, Card, Col, Form, InputGroup, Nav, Row, Table } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link, useSearchParams } from 'react-router-dom';
import { useI18N } from '../../../../commons/i18';
import { getLinkTo } from '../../../../commons/route';
import { PersonPartnerCtrl, PersonPartnerProvider, usePersonPartnerStore } from './ctrl';
import { Helmet } from 'react-helmet';
import SpinnerLoader from '../../../../components/Loader';
import classNames from 'classnames';

const ctrl = new PersonPartnerCtrl();
const PartnerPage: React.FC = () => {
  const __ = useI18N();
  const [tab, setTab] = useState('formated' as string | null);
  const [searchParams] = useSearchParams();
  ctrl.__ = __;

  const document = searchParams.get('document') as string;

  useEffect(() => {
    if (ctrl.document?.replace(/[^\d]/g, '') !== (document || '')) {
      ctrl.handleDocumentAndFind(document);
    }
  }, [document]);

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
        <Nav.Item>
          <Nav.Link onClick={ctrl.exportXLS}>{__('label.xls')}</Nav.Link>
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
      <Table className={classNames({ blur: ctrl.waiting })} striped responsive>
        <thead>
          <tr>
            <th colSpan={6}>Sócios desta empresa:</th>
          </tr>
          <tr>
            <th>Empresa Doc</th>
            <th>Empresa</th>
            <th>Sócio Doc</th>
            <th>Sócio</th>
            <th>Representante Doc</th>
            <th>Representante</th>
          </tr>
        </thead>
        <tbody>
          {ctrl.waiting === null && (
            <tr>
              <td colSpan={6}>{__('msg.enter_filter')}</td>
            </tr>
          )}
          {ctrl.waiting === false && !ctrl.partners && (
            <tr>
              <td colSpan={6}>{__('msg.register_not_found')}</td>
            </tr>
          )}
          {ctrl.partners &&
            ctrl.partners.map((resp, idx) => (
              <tr key={idx}>
                <td>
                  <Link to="#" onClick={(e) => ctrl.handleOpenPersonLegal(e, resp.document)} style={{ whiteSpace: 'nowrap' }}>
                    {resp.document}
                  </Link>
                </td>
                <td>{resp.name}</td>
                <td>{resp.partner_doc}</td>
                <td>{resp.partner}</td>
                <td>{resp.representative_doc}</td>
                <td>{resp.representative_name}</td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Table className={classNames({ blur: ctrl.waiting })} striped responsive>
        <thead>
          <tr>
            <th colSpan={6}>É sócio das empresas:</th>
          </tr>
          <tr>
            <th>Empresa Doc</th>
            <th>Empresa</th>
            <th>Sócio Doc</th>
            <th>Sócio</th>
            <th>Representante Doc</th>
            <th>Representante</th>
          </tr>
        </thead>
        <tbody>
          {ctrl.waiting === null && (
            <tr>
              <td colSpan={6}>{__('msg.enter_filter')}</td>
            </tr>
          )}
          {ctrl.waiting === false && !ctrl.partnersOf && (
            <tr>
              <td colSpan={6}>{__('msg.register_not_found')}</td>
            </tr>
          )}
          {ctrl.partnersOf &&
            ctrl.partnersOf.map((resp, idx) => (
              <tr key={idx}>
                <td>
                  <Link to="#" onClick={(e) => ctrl.handleOpenPersonLegal(e, resp.document)} style={{ whiteSpace: 'nowrap' }}>
                    {resp.document}
                  </Link>
                </td>
                <td>{resp.name}</td>
                <td>{resp.partner_doc}</td>
                <td>{resp.partner}</td>
                <td>{resp.representative_doc}</td>
                <td>{resp.representative_name}</td>
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
