import registerConfig from './register.config';

const defaultAuthConfig = {
  OAUTH_URL: 'http://iam_backend:3000/auth',
  CLIENT_SECRET: 'IAM_JWT_SECRET_YTLXQ3PRMC',
};

const authConfig = {
  // Definição de como enviar o ID Token para o frontend
  SEND_TOKEN_BY: registerConfig.PRODCTION_MODE ? 'header' : 'session',
  //
  TOKEN_HEADER_NAME: 'x-access-token',
  // URL de autenticação do sistema.
  OAUTH_URL: process.env.OAUTH_URL || defaultAuthConfig.OAUTH_URL,
  // URL de autenticação do sistema.
  OAUTH_AUTHORIZE: '/oauth2/authorize',
  // URL de autenticação do sistema.
  OAUTH_TOKEN: '/oauth2/token',
  // Oauth scope
  OAUTH_CALLBACK: registerConfig.PRODCTION_MODE ? '/auth/iam/callback' : `http://localhost:${registerConfig.PORT}/auth/iam/callback`,
  // Oauth scope
  OAUTH_SCOPE: 'iam_all',
  // Identificação do Cliente
  CLIENT_ID: '33333333-0000-0000-0000-000000000001',
  CLIENT_SECRET: process.env.OAUTH_URL || defaultAuthConfig.CLIENT_SECRET,
};

export default authConfig;
