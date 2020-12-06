const { createLogger, format, transports } = require('winston');
const { colorize, combine, printf, timestamp } = format;
const config = require('config');


const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message} \n`;
  });

  const transportArr = [
    new transports.Console({level: config.get("printMode") == "debug" ? 'debug' : 'warn'}),
    new transports.File({filename: 'errors.log', level: 'error'}),
    new transports.File({ filename: 'combined.log', level:'warn' }),
];

const logger = createLogger({
 levels:{
    error: 0,
    info: 1,
    warn: 2,
    debug: 3
  },
  format: combine(
    timestamp(),
    colorize(),
    myFormat
  ),
  defaultMeta: { service: 'user-service' },
  transports: transportArr
});
 

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple(),
  }));
}

module.exports = { logger };