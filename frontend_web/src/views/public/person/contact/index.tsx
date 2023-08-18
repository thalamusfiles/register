import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Alert, Button, ButtonGroup, Card, Col, Form, InputGroup, Nav, Row, Table } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link } from 'react-router-dom';
import { useI18N } from '../../../../commons/i18';
import { getLinkTo } from '../../../../commons/route';
import { notify } from '../../../../components/Notification';
import { ContactProvider, ContactCtrl, useTypeBusinessTypeStore } from './ctrl';
import { Helmet } from 'react-helmet';
import { StatePickerPlugin } from '../../state/state-picker';
import { CityPickerPlugin } from '../../city/city-picker';
import { CnaePickerPlugin } from '../../cnaes/cnae-picker';

const ctrl = new ContactCtrl();
const ContactPage: React.FC = () => {
  const __ = useI18N();
  const [tab, setTab] = useState('formated' as string | null);

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
      <Row className="align-items-center">
        <Col md={3}>
          <Form.Label htmlFor="country" visuallyHidden>
            {__('country.brazil')}
          </Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text>{__('label.country')}</InputGroup.Text>
            <Form.Control id="country" placeholder={__('country.brazil')} disabled />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Label htmlFor="document" visuallyHidden>
            {__('label.state')}
          </Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text>{__('label.state')}</InputGroup.Text>
            <StatePickerPlugin name="state" value={ctrl.state?.code} description={ctrl.state?.name || __('label.select')} onSel={ctrl.handleState} />
          </InputGroup>
        </Col>
        <Col md={3}>
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
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Label htmlFor="document" visuallyHidden>
            {__('label.business_type')}
          </Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text>{__('label.business_type')}</InputGroup.Text>
            <CnaePickerPlugin
              name="state"
              value={ctrl.businessType?.key}
              description={ctrl.businessType?.key || __('label.select')}
              onSel={ctrl.handleBusinessType}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Label htmlFor="document" visuallyHidden>
            {__('label.limit.offset')}
          </Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text>{__('label.limit.offset')}</InputGroup.Text>
            <Form.Control id="document" value={ctrl.limit} onChange={ctrl.handleLimit} />
            <Form.Control id="document" value={ctrl.offset} onChange={ctrl.handleOffset} />
          </InputGroup>
        </Col>
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

const ContactPrettyResult: React.FC = observer(() => {
  const ctrl = useTypeBusinessTypeStore();
  const __ = useI18N();

  return (
    <>
      <h2>{__('label.result')}</h2>
      <Table>
        <thead>
          <tr>
            <td>Cnae</td>
            <td>Doc</td>
            <td>Nome</td>
            <td>Telefone</td>
            <td>E-mail</td>
            <td>Fax</td>
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
                <td>{resp.main_activity}</td>
                <td>
                  <Link to="#" onClick={(e) => ctrl.handleOpenPersonLegal(e, resp.document)} style={{ whiteSpace: 'nowrap' }}>
                    {resp.document}
                  </Link>
                </td>
                <td>{resp.name}</td>
                <td>{resp.phone?.join(', ')}</td>
                <td>{resp.email?.join(', ')}</td>
                <td>{resp.fax?.join(', ')}</td>
              </tr>
            ))}
        </tbody>
      </Table>
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
          {!ctrl.wanted && <p>{__('msg.enter_filter')}</p>}
          {ctrl.wanted && !ctrl.response && <p>{__('msg.register_not_found')}</p>}
          {ctrl.response && <pre>{JSON.stringify(ctrl.response, null, 2)}</pre>}
        </Card.Body>
      </Card>
    </>
  );
});

export default ContactPage;
export { ContactBreadcrum };
