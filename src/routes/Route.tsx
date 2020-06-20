/**
 * Este script Route irá controlar o redirecionamento do usuário para páginas,
 * dependendo dele estar autenticado, ou não.
 *
 * O método principal "Route", extende os mesmo tipos do ReactRouterDOM e adiciona
 * um parâmetro isPrivate, que irá dizer se a rota é privada, ou não.
 *
 * Resumo da lógica:
 *   Será usada a propriedade "render" do Route. O "render" recebe uma função.
 *     Se página (componente) privada e usuário logado, será redirecionada para a página
 *     Se não
 *       Se página privada, será redirecionada para o login
 *       Se página aberta, será redirecionada para o dashboard
 */

import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';
import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();
  const isSigned = !!user;
  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === isSigned ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              state: {
                from: location,
              } /* O location é usado para manter as setas de navegação do browser */,
            }}
          />
        );
      }}
    />
  );
};

export default Route;
