import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Alert, Button, ButtonGroup, Card, Col, Form, InputGroup, Row, Table } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link, useSearchParams } from 'react-router-dom';
import { useI18N } from '../../../../commons/i18';
import { getLinkTo } from '../../../../commons/route';
import { notify } from '../../../../components/Notification';
import { AddressZipcodeProvider, AddressZipcodeCtrl, useAddressZipcodeStore } from './ctrl';

const ctrl = new AddressZipcodeCtrl();
const BusinessTypePage: React.FC = () => {
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
    if (ctrl.zipcode !== document) {
      ctrl.handleDocument({ target: { value: document || '' } });
      if (ctrl.zipcode) {
        ctrl.findDocument();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctrl]);

  return (
    <AddressZipcodeProvider value={ctrl}>
      <Alert variant="secondary" className="p-4">
        <h2>{__('address.bu.title')}</h2>
        <p>{__('address.zipcode.description')}</p>

        <BusinessTypeForm />
      </Alert>
      <BusinessTypePrettyResult />
      <BusinessTypeResult />
    </AddressZipcodeProvider>
  );
};

const BusinessTypeBreadcrum: React.FC = () => {
  const __ = useI18N();
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">{__('menu.home')}</Breadcrumb.Item>
      <Breadcrumb.Item href={getLinkTo('persons')}>{__('menu.persons')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{__('menu.person_legal')}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

const BusinessTypeForm: React.FC = observer(() => {
  const ctrl = useAddressZipcodeStore();
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
            <Form.Select size="sm">
              <option>Selecione...</option>
            </Form.Select>
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Label htmlFor="document" visuallyHidden>
            {__('label.city')}
          </Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text>{__('label.city')}</InputGroup.Text>
            <Form.Select size="sm">
              <option>Selecione...</option>
            </Form.Select>
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Label htmlFor="document" visuallyHidden>
            {__('label.business_type')}
          </Form.Label>
          <InputGroup className="mb-2">
            <InputGroup.Text>{__('label.business_type')}</InputGroup.Text>
            <Form.Select size="sm">
              <option>Selecione...</option>
            </Form.Select>
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

const BusinessTypePrettyResult: React.FC = observer(() => {
  const ctrl = useAddressZipcodeStore();
  const __ = useI18N();

  return (
    <>
      <h2>{__('label.result')}</h2>
      <Table>
        <thead>
          <tr>
            <td>Zipcode</td>
            <td>Tipo empresa</td>
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
                <td>{resp.zipcode}</td>
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

const BusinessTypeResult: React.FC = observer(() => {
  const ctrl = useAddressZipcodeStore();
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

export default BusinessTypePage;
export { BusinessTypeBreadcrum };
