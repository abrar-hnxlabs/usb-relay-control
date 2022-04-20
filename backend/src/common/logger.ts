import winston, { Logform } from "winston";

export function logger(): winston.Logger {
  const log: winston.Logger = winston.createLogger({
    level: "info",
    format: winston.format.combine (
      winston.format.splat(),
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports:[
      new winston.transports.Console()
    ]
  });

  if(process.env.PROD) {
    log.add(new winston.transports.File({ filename: 'combined.log' }),)
  }
  return log;
}
