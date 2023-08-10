import { WinstonModule } from 'nest-winston';
import { createLogger, transports } from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import logConfig from '../../config/log.config';
import { loggerFormat, loggerFormatConsole } from './logger-format';

/**
 * Cria o logger do Wiston
 * @returns
 */
const createWinstonLogger = (name: string) => {
  const transps = [];

  // Transporte para saida em console
  if (logConfig.CONSOLE_LOG) {
    transps.push(
      new transports.Console({
        level: logConfig.LEVEL,
        format: loggerFormatConsole(name),
      }),
    );
  }

  // Transporte arquivos em disco
  if (logConfig.FILE_LOG) {
    transps.push(
      new transports.File({
        level: logConfig.LEVEL,
        format: loggerFormat(name),
        maxsize: logConfig.MAX_FILE_SIZE,
        filename: `${logConfig.FOLDER_PATH}/${name}.log`,
      }),
    );
  }

  // Transporte para ElasticSearch
  if (logConfig.ELASTICSEARCH_URLS) {
    const node = logConfig.ELASTICSEARCH_URLS;
    const elasticTransport = new ElasticsearchTransport({
      index: logConfig.ELASTICSEARCH_INDEX,
      //level: 'info',
      clientOpts: {
        node,
        auth: { username: logConfig.ELASTICSEARCH_USER, password: logConfig.ELASTICSEARCH_PASS },
      },
    });
    transps.push(elasticTransport);
  }

  const logger = createLogger({
    transports: transps,
  });

  return logger;
};

const createNestLogger = () => {
  return WinstonModule.createLogger({
    instance: createWinstonLogger('general'),
  });
};

export default createNestLogger;
