import registerConfig from './register.config';

const defaultLogConfig = {
  AUTH_URL: 'http://localhost:3000',
};

const authConfig = {
  // URL de autenticação do sistema.
  OAUTH_URL: process.env.AUTH_URL || defaultLogConfig.AUTH_URL,
  // URL de autenticação do sistema.
  OAUTH_AUTHORIZE: '/auth/oauth2/authorize',
  // URL de autenticação do sistema.
  OAUTH_TOKEN: '/auth/oauth2/token',
  // Oauth scope
  OAUTH_CALLBACK: process.env.NODE_ENV !== 'production' ? `http://localhost:${registerConfig.SYSTEM_PORT}/auth/iam/callback` : '',
  // Oauth scope
  OAUTH_SCOPE: 'iam_all',
  // URL de autenticação do sistema.
  CLIENT_ID: '33333333-0000-0000-0000-000000000001',
};

export default authConfig;
