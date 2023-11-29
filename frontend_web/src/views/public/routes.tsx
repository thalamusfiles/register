import { Navigate, Route, Routes } from 'react-router-dom';
import { RoutesDefinition } from '../../commons/route';
import { InModal } from '../../components/Modal';
import AddressPage from './address';
import Home from './home';
import PersonPage from './person';
import RelEstablishmentPage from './rel_establishment';
import RelTypePage from './rel_type';
import TypePage from './type';
import TokenLoad from './token-load';

/**
 * Definições das rotas.
 * Nome da propriedade é utilizado como identificador da rota
 */
export const routes: RoutesDefinition = {
  // Home
  home: { path: '/home', component: Home, index: true },
  // Apis
  person: { path: '/person', component: PersonPage, index: true },
  type: { path: '/types', component: TypePage, index: true },
  addresses: { path: '/addresses', component: AddressPage, index: true },
  // Rels
  rel_establishment: { path: '/rel/establishment', component: RelEstablishmentPage, index: true },
  rel_type: { path: '/rel/type', component: RelTypePage, index: true },
};

/**
 * Rotas
 */
export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/app/tokenload" element={<TokenLoad />} index />

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
