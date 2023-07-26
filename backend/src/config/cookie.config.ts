const defaultConfig = {
  REGISTER_SESSION_SECRET: 'REGISTER_SESSION_SECRET_I1vS3cxO807i',
};

const cookieConfig = {
  NAME: 'register',
  PATH: '/auth',
  SECRET: process.env.REGISTER_SESSION_SECRET || defaultConfig.REGISTER_SESSION_SECRET,
  HTTP_ONLY: process.env.NODE_ENV === 'production',
  SAME_SITE: process.env.NODE_ENV === 'production' ? undefined : false,
  MAX_AGE: 60 * 60 * 24 * 30 * 3,
};

export default cookieConfig;
