import winston, { type transport } from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { version: (await Bun.file("./version").text())?.trim() },
  exitOnError: false,
  transports: getTransports(),
  silent: Bun.env.NODE_ENV === "test",
});

function getTransports() {
  const transports: transport[] = [
    //
    // - Write all logs with importance level of `error` or higher to `error.log`
    //   (i.e., error, fatal, but not other levels)
    //
    new winston.transports.File({
      filename: `${Bun.env.LOG_FOLDER}/error.log`,
      level: "error",
      handleExceptions: true,
    }),
    //
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //   (i.e., fatal, error, warn, and info, but not trace)
    //
    new winston.transports.File({
      filename: `${Bun.env.LOG_FOLDER}/combined.log`,
    }),
  ];

  if (process.env.NODE_ENV !== "production") {
    transports.push(
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    );
  }

  return transports;
}
