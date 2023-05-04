const registerConfig = {
  PRODCTION_MODE: process.env.NODE_ENV === 'production',
  PORT: process.env.PORT || 3000,
  STATIC_FILE_MAX_AGE: 2 * 24 * 60 * 60 * 1000,
};

export default registerConfig;
