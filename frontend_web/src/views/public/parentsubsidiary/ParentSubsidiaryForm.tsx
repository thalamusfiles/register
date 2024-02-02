import { observer } from 'mobx-react-lite';
import { Alert, Button, ButtonGroup, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { useI18N } from '../../../commons/i18';
import { usePersonPartnerStore } from './ctrl';

export const ParentSubsidiaryForm: React.FC = observer(() => {
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
