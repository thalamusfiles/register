const port = parseInt(process.env.SYSTEM_PORT) || 3001;

const registerConfig = {
  PRODCTION_MODE: process.env.NODE_ENV === 'production',
  PORT: port,
  STATIC_FILE_MAX_AGE: 2 * 24 * 60 * 60 * 1000,
  // Dev configs
  DEV_URL: `http://localhost:${port + 1000}`,
};

export default registerConfig;
