const defaultLogConfig = {
  LOG_FOLDER_PATH: 'tmp/logs',
};

const logConfig = {
  // Log level
  LEVEL: 'debug',

  // Exibir log no console
  CONSOLE_LOG: process.env.NODE_ENV !== 'production',

  // Salvar log em arquivo
  FILE_LOG: (process.env.FILE_LOG || 'false').toLocaleLowerCase() === 'true',
  // Caminho para salvar os logs de registros
  FOLDER_PATH: process.env.LOG_FOLDER_PATH || defaultLogConfig.LOG_FOLDER_PATH,
  // Tamanho máximo do arquivo
  MAX_FILE_SIZE: 5 * 1024 * 1024,

  // Salvar no ELK
  ELASTICSEARCH_URLS: (process.env.ELASTICSEARCH_URLS || false) as string | false,
  ELASTICSEARCH_USER: process.env.ELASTICSEARCH_USER,
  ELASTICSEARCH_PASS: process.env.ELASTICSEARCH_PASS,
  ELASTICSEARCH_INDEX: process.env.ELASTICSEARCH_INDEX,

  // Salvar no EasyLogger
  EASYLOGGER_URLS: (process.env.EASYLOGGER_URLS || false) as string | false,
  EASYLOGGER_INDEX: process.env.EASYLOGGER_INDEX,
  EASYLOGGER_PRODUCT_INDEX: process.env.EASYLOGGER_PRODUCT_INDEX,
};

export default logConfig;
