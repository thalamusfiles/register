import { WinstonModule } from 'nest-winston';
import { createLogger, transports } from 'winston';
import logConfig from '../../config/log.config';
import { loggerFormat, loggerFormatConsole } from './logger-format';
import EasyLoggerTransport from './easylogger.transport';

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

  // Transporte para EasyLogger
  if (logConfig.EASYLOGGER_URLS) {
    if (logConfig.EASYLOGGER_INDEX) {
      const easyLoggerTransport = new EasyLoggerTransport({
        endpoint: logConfig.EASYLOGGER_URLS,
        index: logConfig.EASYLOGGER_INDEX,
      });

      transps.push(easyLoggerTransport);
    }

    // Transporte com filtro de produto
    if (logConfig.EASYLOGGER_PRODUCT_INDEX) {
      const easyLoggerTransport = new EasyLoggerTransport({
        endpoint: logConfig.EASYLOGGER_URLS,
        index: logConfig.EASYLOGGER_PRODUCT_INDEX,
        filter: (info: any) => {
          return !!info?.product;
        },
      });

      transps.push(easyLoggerTransport);
    }
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
