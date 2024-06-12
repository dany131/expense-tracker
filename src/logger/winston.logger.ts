import { createLogger, format, transports } from "winston";


const options = {
  file: {
    filename: "error.log",
    level: "error"
  },
  console: {
    level: "silly"
  }
};

// for dev environment
const devLogger = {
  format: format.combine(
    format.colorize({ all: true }),
    format.timestamp(),
    format.errors({ stack: true }),
    format.simple()
  ),
  transports: [new transports.Console(options.console)]
};

// for production environment
const prodLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File(options.file),
    new transports.File({
      filename: "combine.log",
      level: "info"
    })
  ]
};

// export log instance based on the current environment
const instanceLogger = (process.env.ENVIRONMENT === "production") ? prodLogger : devLogger;

export const instance = createLogger(instanceLogger);
