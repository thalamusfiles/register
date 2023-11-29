import registerConfig from './register.config';

const defaultAuthConfig = {
  OAUTH_URL: 'http://iam_backend:3000/auth',
  CLIENT_SECRET: 'IAM_JWT_SECRET_YTLXQ3PRMC',
};

const authConfig = {
  //
  TOKEN_HEADER_NAME: 'x-access-token',
  // URL de autenticação do sistema.
  OAUTH_URL: process.env.OAUTH_URL || defaultAuthConfig.OAUTH_URL,
  // Oauth scope
  OAUTH_SCOPE: 'iam_all',
  // Oauth callback
  OAUTH_CALLBACK: registerConfig.PRODCTION_MODE
    ? 'http://register.thalamus.digital/auth/iam/callback'
    : `http://localhost:${registerConfig.PORT}/auth/iam/callback`,
  // Identificação do Cliente
  CLIENT_ID: 'ada56e83-7f4b-41c8-8645-1c918320c580',
  CLIENT_SECRET: process.env.CLIENT_SECRET || defaultAuthConfig.CLIENT_SECRET,
};

export default authConfig;
