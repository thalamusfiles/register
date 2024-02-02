import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Alert, Button, ButtonGroup, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useSearchParams } from 'react-router-dom';
import { useI18N } from '../../../commons/i18';
import { ParentSubsidiaryCtrl, ParentSubsidiaryProvider, usePersonPartnerStore } from './ctrl';
import { Helmet } from 'react-helmet';
import SpinnerLoader from '../../../components/Loader';
import classNames from 'classnames';
import SideBarHome from '../home/sidebarhome';
import DeveloperGuide from '../../cards/developer-guide';

const ctrl = new ParentSubsidiaryCtrl();
const ParentSubsidiaryPage: React.FC = () => {
  const __ = useI18N();
  const [searchParams] = useSearchParams();
  ctrl.__ = __;

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
    <Container fluid>
      <ParentSubsidiaryBreadcrum />
      <Row>
        <Col md={2} className="d-none d-lg-block">
          <SideBarHome />
        </Col>
        <Col>
          <Row>
            <Col md={12} lg={9}>
              <h1>{__('menu.parentsubsidiary')}</h1>
              <p>{__('home.parentsubsidiary_description')}</p>

              <ParentSubsidiaryProvider value={ctrl}>
                <Helmet title={__('person.legal.title')}>
                  <meta name="description" content={__('person.legal.meta')} />
                </Helmet>

                <Alert variant="secondary" className="p-4">
                  <h2>{__('parentsubsidiary.legal.title')}</h2>
                  <p>{__('parentsubsidiary.legal.description')}</p>

                  <ParentSubsidiaryForm />
                </Alert>

                <PartnerPrettyResult />
              </ParentSubsidiaryProvider>
            </Col>

            <Col sm={3}>
              <DeveloperGuide />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

const ParentSubsidiaryBreadcrum: React.FC = () => {
  const __ = useI18N();
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">{__('menu.home')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{__('menu.person_legal')}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

const ParentSubsidiaryForm: React.FC = observer(() => {
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
            {/*
            <Button type="button" className="mb-2" variant="outline-primary" disabled={!!ctrl.waiting} onClick={ctrl.findDocumentRandom}>
              {__('action.random_search')}
            </Button>
            */}
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
        {__('label.hierarchicalrelationship')} <SpinnerLoader show={!!ctrl.waiting} />
      </h2>
      <Table className={classNames({ blur: ctrl.waiting })} striped responsive>
        <thead>
          <tr>
            <th style={{ width: '5%' }}>Nível</th>
            <th>Matriz</th>
            <th>Filial Doc</th>
            <th>Filial</th>
            <th>Estado</th>
            <th>Cidade</th>
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
                <td className="text-nowrap">{resp._pag}</td>
                <td>{resp.parentDoc}</td>
                <td>{resp.subsidiaryDoc}</td>
                <td>{resp.subsidiary}</td>
                <td>{resp.stateCode}</td>
                <td>{resp.cityName}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
});

export default ParentSubsidiaryPage;
export { ParentSubsidiaryBreadcrum as PartnerBreadcrum };
