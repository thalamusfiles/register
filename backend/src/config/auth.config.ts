const defaultLogConfig = {
  AUTH_URL: 'http://localhost:3000',
};

const authConfig = {
  // URL de autenticação do sistema.
  AUTH_URL: process.env.AUTH_URL || defaultLogConfig.AUTH_URL,
  // URL de autenticação do sistema.
  AUTH_URL_PATH: '/auth/app/:clienteId/login',
  // URL de autenticação do sistema.
  APP_REGISTER_ID: '33333333-0000-0000-0000-000000000001',
};

export default authConfig;
