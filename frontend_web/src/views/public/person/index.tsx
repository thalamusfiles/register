import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import PersonLegalPage, { PersonLegalBreadcrum } from './legal';

const PersonPage: React.FC = () => {
  return (
    <>
      <Container fluid>
        <Routes>
          <Route path="/legal" element={<PersonLegalBreadcrum />} />
          <Route path="/partner" element={<PersonLegalBreadcrum />} />
        </Routes>
        <Routes>
          <Route path="/legal" element={<PersonLegalPage />} />
          <Route path="/partner" element={<PersonLegalPage />} />
        </Routes>
      </Container>
    </>
  );
};

export default PersonPage;
