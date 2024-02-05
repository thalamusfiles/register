import { useEffect } from 'react';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useSearchParams } from 'react-router-dom';
import { useI18N } from '../../../commons/i18';
import { ParentSubsidiaryCtrl, ParentSubsidiaryProvider, usePersonPartnerStore } from './ctrl';
import { Helmet } from 'react-helmet';
import SideBarHome from '../home/sidebarhome';
import DeveloperGuide from '../../cards/developer-guide';
import { ParentSubsidiaryTableResult } from './ParentSubsidiaryTableResult';
import { ParentSubsidiaryForm } from './ParentSubsidiaryForm';
import { ParentSubsidiaryFlowResult } from './ParentSubsidiaryFlowResult';
import SpinnerLoader from '../../../components/Loader';
import { observer } from 'mobx-react-lite';

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
                <Helmet title={__('person.corporate.title')}>
                  <meta name="description" content={__('person.corporate.meta')} />
                </Helmet>

                <Alert variant="secondary" className="p-4">
                  <h2>{__('parentsubsidiary.corporate.title')}</h2>
                  <p>{__('parentsubsidiary.corporate.description')}</p>

                  <ParentSubsidiaryForm />
                </Alert>

                <SubTitle />
                <ParentSubsidiaryFlowResult />
                <ParentSubsidiaryTableResult />
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

const SubTitle: React.FC = observer(() => {
  const ctrl = usePersonPartnerStore();
  const __ = useI18N();

  return (
    <h2>
      {__('label.hierarchicalrelationship')} <SpinnerLoader show={!!ctrl.waiting} />
    </h2>
  );
});

const ParentSubsidiaryBreadcrum: React.FC = () => {
  const __ = useI18N();

  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">{__('menu.home')}</Breadcrumb.Item>
      <Breadcrumb.Item active>{__('menu.person_legal')}</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default ParentSubsidiaryPage;
export { ParentSubsidiaryBreadcrum as PartnerBreadcrum };
