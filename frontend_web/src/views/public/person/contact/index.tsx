import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Alert, Button, ButtonGroup, Card, Col, Form, InputGroup, Nav, Pagination, Row, Table } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link } from 'react-router-dom';
import { useI18N } from '../../../../commons/i18';
import { getLinkTo } from '../../../../commons/route';
import { ContactProvider, ContactCtrl, useTypeBusinessTypeStore } from './ctrl';
import { Helmet } from 'react-helmet';
import { StatePickerPlugin } from '../../state/state-picker';
import { CityPickerPlugin } from '../../city/city-picker';
import { CnaePickerPlugin } from '../../cnaes/cnae-picker';
import classNames from 'classnames';
import SpinnerLoader from '../../../../components/Loader';

const ctrl = new ContactCtrl();
const ContactPage: React.FC = () => {
  const __ = useI18N();
  const [tab, setTab] = useState('formated' as string | null);
  ctrl.__ = __;

  useEffect(() => {
    ctrl.init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctrl]);

  return (
    <ContactProvider value={ctrl}>
      <Helmet title={__('person.contact.title')}>
        <meta name="description" content={__('person.contact.meta')} />
      </Helmet>

      <Alert variant="secondary" className="p-4">
        <h2>{__('person.contact.title')}</h2>
        <p>{__('person.contact.description')}</p>

        <ContactForm />
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

      {tab === 'formated' && <ContactPrettyResult />}
      {tab === 'json' && <ContactResult />}
    </ContactProvider>
  );
};

const ContactBreadcrum: React.FC = () => {
  const __ = useI18N();
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">{__('menu.home')}</Breadcrumb.Item>
      <Breadcrumb.Item href={getLinkTo('persons')}>{__('menu.type')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{__('menu.contact')}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

const ContactForm: React.FC = observer(() => {
  const ctrl = useTypeBusinessTypeStore();
  const __ = useI18N();

  return (
    <Form>
      {!!ctrl.erroMessages?.length && (
        <Alert variant="danger">
          {ctrl.erroMessages
            .map(__)
            .filter((value) => value)
            .map((msg) => (
              <>
                {msg} <br />
              </>
            ))}
        </Alert>
      )}

      <Row className="align-items-center">
        <Col xl={3}>
          <Form.Label htmlFor="country" visuallyHidden>
            {__('country.brazil')}
          </Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text>{__('label.country')}</InputGroup.Text>
            <Form.Control id="country" placeholder={__('country.brazil')} disabled isValid={!!ctrl.erroMessages.length} />
            <Form.Control.Feedback type="valid">{__('label.valid')}</Form.Control.Feedback>
          </InputGroup>
        </Col>
        <Col xl={3}>
          <Form.Label htmlFor="document" visuallyHidden>
            {__('label.state')}
          </Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text>{__('label.state')}</InputGroup.Text>
            <StatePickerPlugin
              name="state"
              value={ctrl.state?.code}
              description={ctrl.state?.name || __('label.select')}
              onSel={ctrl.handleState}
              isValid={!!ctrl.erroMessages.length}
            />
            <Form.Control.Feedback type="valid">{__('label.valid')}</Form.Control.Feedback>
          </InputGroup>
        </Col>
        <Col xl={3}>
          <Form.Label htmlFor="document" visuallyHidden>
            {__('label.city')}
          </Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text>{__('label.city')}</InputGroup.Text>
            <CityPickerPlugin
              name="state"
              stateCode={ctrl.state?.code}
              value={ctrl.city?.code}
              description={ctrl.city?.name || __('label.select')}
              onSel={ctrl.handleCity}
              isValid={!!ctrl.erroMessages.length && !ctrl.erros?.cityCode}
              isInvalid={!!ctrl.erros?.cityCode}
            />
            <Form.Control.Feedback type="valid">{__('label.valid')}</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">{ctrl.erros?.cityCode?.map(__)}</Form.Control.Feedback>
          </InputGroup>
        </Col>
        <Col xl={3}>
          <Form.Label htmlFor="document" visuallyHidden>
            {__('label.business_type')}
          </Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text>{__('label.business_type')}</InputGroup.Text>
            <CnaePickerPlugin
              name="state"
              description={ctrl.businessType?.map((x) => x.key).join(',  ') || __('label.select')}
              onSel={ctrl.handleBusinessType}
              isValid={!!ctrl.erroMessages.length && !ctrl.erros?.businessType}
              isInvalid={!!ctrl.erros?.businessType}
              multi
            />
            <Form.Control.Feedback type="valid">{__('label.valid')}</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">{ctrl.erros?.businessType?.map(__)}</Form.Control.Feedback>
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={5} xll={3}>
          <Form.Label htmlFor="document" visuallyHidden>
            {__('label.pager.limit')}
          </Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text>{__('label.pager.limit')}</InputGroup.Text>
            <Form.Control
              id="document"
              value={ctrl.limit}
              onChange={ctrl.handleLimit}
              isValid={!!ctrl.erroMessages.length && !ctrl.erros?.limit}
              isInvalid={!!ctrl.erros?.limit}
            />
            <Form.Control.Feedback type="valid">{__('label.valid')}</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">{ctrl.erros?.limit?.map(__)}</Form.Control.Feedback>
          </InputGroup>
        </Col>
        <Col>
          <ButtonGroup className="float-end">
            <Button type="button" className="mb-2" disabled={!!ctrl.waiting} onClick={ctrl.handleFindDocument}>
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

const ContactPrettyResult: React.FC = observer(() => {
  const ctrl = useTypeBusinessTypeStore();
  const __ = useI18N();

  return (
    <>
      <h2>
        {__('label.result')} <SpinnerLoader show={!!ctrl.waiting} />
      </h2>
      <Table className={classNames({ blur: ctrl.waiting })}>
        <thead>
          <tr>
            <td>Empresa Doc</td>
            <td>Empresa</td>
            <td>Sócio</td>
            <td>Telefone</td>
            <td>E-mail</td>
            <td>Fax</td>
            <td>Cnae</td>
            <td>Zipcode</td>
          </tr>
        </thead>
        <tbody>
          {ctrl.waiting === null && (
            <tr>
              <td colSpan={8}>{__('msg.enter_filter')}</td>
            </tr>
          )}
          {ctrl.waiting === false && !ctrl.response && (
            <tr>
              <td colSpan={8}>{__('msg.register_not_found')}</td>
            </tr>
          )}
          {ctrl.response &&
            ctrl.response.map((resp, idx) => (
              <tr key={idx}>
                <td>
                  <Link to="#" onClick={(e) => ctrl.handleOpenPersonLegal(e, resp.document)} style={{ whiteSpace: 'nowrap' }}>
                    {resp.document}
                  </Link>
                </td>
                <td>{resp.name}</td>
                <td>
                  {resp.partner}
                  {!!resp.representative_name && ` (${resp.representative_name})`}
                </td>
                <td>{resp.phone?.join(', ')}</td>
                <td>{resp.email?.join(', ')}</td>
                <td>{resp.fax?.join(', ')}</td>
                <td>
                  <strong>{resp.main_activity}</strong>
                  <br />
                  {resp.other_activities?.join(', ')}
                </td>
                <td>{resp.zipcode}</td>
              </tr>
            ))}
        </tbody>
      </Table>

      <Pagination className="mr-2" size="sm" style={{ marginBottom: 0 }}>
        <Pagination.Prev onClick={ctrl!.handlePreviewsPage} disabled={ctrl.page === 1} id="previews_page" />
        <Pagination.Item>{ctrl!.page}</Pagination.Item>
        <Pagination.Next onClick={ctrl!.handleNextPage} id="next_page" />
      </Pagination>
    </>
  );
});

const ContactResult: React.FC = observer(() => {
  const ctrl = useTypeBusinessTypeStore();
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

export default ContactPage;
export { ContactBreadcrum };
