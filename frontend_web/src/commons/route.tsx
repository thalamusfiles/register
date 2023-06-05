import type { Router as RemixRouter } from '@remix-run/router';
import qs from 'qs';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import { localStorageDef } from './consts';
import { RoutesName } from './routes-name';
import Storage from './storage';

export type RouteDefinition = { path: string; component: any; index?: boolean };
export type RoutesDefinition = { [key: string]: RouteDefinition };

let router: RemixRouter;
export const createBaseRouter = (routes: RouteObject[]): RemixRouter => (router = createBrowserRouter(routes));

export function getLinkTo(owner: RoutesName | string | number, options: { uuid: string } & any = {}): string {
  let push;
  switch (owner as RoutesName) {
    // PUBLIC
    case 'login':
      push = '/public/home';
      break;
    case 'home_public':
      push = '/public/home';
      break;
    case 'persons':
      push = '/public/person';
      break;
    case 'person_legal':
      push = '/public/person/legal';
      break;
    case 'person_partner':
      push = '/public/person/partner';
      break;
    case 'addresses':
      push = '/public/addresses';
      break;
    case 'addresses_zipcode':
      push = '/public/addresses/zipcode';
      break;
    case 'addresses_businesstype':
      push = '/public/addresses/businesstype';
      break;
    default:
      push = owner as string;
      break;
  }

  if (options?.inModal) {
    const search = window.location.search + qs.stringify(options.search);
    let newLocation = window.location.pathname + '/modal' + push.replace(/\/mgt/, '') + '?' + search;
    if (options?.showSave) {
      newLocation = newLocation + '&show_save=show_save';
    }
    return newLocation;
  } else if (options.search) {
    push += '?' + qs.stringify(options.search);
  }

  return push;
}

export function historyPush(
  owner: RoutesName | string | number,
  options: { uuid?: any; inModal?: boolean; showSave?: boolean; open?: boolean; absolute?: boolean; search?: string } & any = {},
) {
  // Quando informado número, volta pra páginas anteriores ou posteriores.
  if (typeof owner === 'number') router.navigate(owner);

  const push = getLinkTo(owner, options);

  if (options?.open) {
    if (options.absolute) {
      window.open(push);
    } else {
      window.open(`${push}`);
    }
  } else {
    router.navigate(push);
  }
}

/**
 * Altera os filtros informados na URL.
 * Altera tudo que tem depois do ? na URL.
 * @param params
 */
export function historyReplace(search: any = {}) {
  search = Object.assign({}, search);

  router.navigate(
    {
      pathname: router.state.location.pathname,
      search: qs.stringify(search),
    },
    { replace: true },
  );
}

/**
 * Retorna os filtros informados na url
 */
export function historySearch(options: { parseArrays?: boolean } = {}) {
  return qs.parse(window.location.search.slice(1), options);
}

/**
 * Dispara uma função quando o usuário clica em historyback
 */
const hPopsCallbacks: any[] = [];
export function historyOnPop(listener: any) {
  hPopsCallbacks.push(listener);
}

/**
 * Verifica se esta autenticado e libera a rota
 * @param param0
 */
export const PrivateRoutes = ({ redirect, element }: { redirect: string; element: JSX.Element }): JSX.Element => {
  return Storage.getItem(localStorageDef.tokenKey) ? element : <Navigate to={redirect} />;
};
