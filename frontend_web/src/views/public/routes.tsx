import { Navigate, Route, Routes } from 'react-router-dom';
import { RoutesDefinition } from '../../commons/route';
import { InModal } from '../../components/Modal';
import AddressPage from './address';
import Home from './home';
import PersonPage from './person';

/**
 * Definições das rotas.
 * Nome da propriedade é utilizado como identificador da rota
 */
export const routes: RoutesDefinition = {
  // Home
  home: { path: '/home', component: Home, index: true },
  person: { path: '/person', component: PersonPage, index: true },
  addresses: { path: '/addresses', component: AddressPage, index: true },
};

/**
 * Rotas
 */
export default function PublicRoutes() {
  return (
    <Routes>
      {Object.values(routes).map((route, idx) => (
        <Route index={route.index} path={route.path.concat('/*')} element={<route.component />} key={idx} />
      ))}
      <Route path="/" element={<Navigate to={'/public/home'} replace />} />
    </Routes>
  );
}

/**
 * Criar rotas para serem exibidas em modal.
 * @param props
 */
export function PublicModalRoutes(props: any) {
  //Component modal com as rotas
  const modalComponent = (
    <InModal>
      <Routes>
        {Object.values(routes).map((route, idx) => (
          <Route path={route.path.concat('/*')} element={<route.component inModal={true} {...props} />} key={idx} />
        ))}
      </Routes>
    </InModal>
  );
  // Adiciona prepende para abertura do modal
  return (
    <Routes>
      <Route path={':ignore1/modal/*'} element={modalComponent} />
      <Route path={':ignore1/:ignore2/modal/*'} element={modalComponent} />
    </Routes>
  );
}
