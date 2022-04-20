import winston from "winston";

export const logger: winston.Logger = winston.createLogger({
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
