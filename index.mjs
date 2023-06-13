import express from "express";
import { validateAndFormat } from "./validateAndFormat.mjs";
import { createLogger, transports, format } from "winston";
import LokiTransport from "winston-loki";
import morgan from "morgan";
import { config } from "dotenv";
import { deleteData } from "./deleteHandle.mjs";
config();
const ENV = process.env;
const ENV_VARS = [
  "INFLUX_TOKEN",
  "INFLUX_URL",
  "INFLUX_ORG",
  "INFLUX_BUCKET",
  "PORT",
  "GRAFANA_API_KEY",
  "LOKI_USERNAME",
  "NODE_ENV",
];

ENV_VARS.forEach((e) => {
  if (!ENV[e]) {
    throw new Error(`${e} env variable is not defined`);
  }
});

const app = express();

app.use(express.json());

//winston transport connection to grafana loki
const logger = createLogger({
  transports: [
    new LokiTransport({
      host: "https://logs-prod3.grafana.net",
      labels: { app: process.env.APP_LABEL || "remote_diagnosis" },
      json: true,
      format: format.json(),
      replaceTimestamp: true,
      basicAuth: `${process.env.LOKI_USERNAME}:${process.env.GRAFANA_API_KEY}`,
      onConnectionError: (err) => console.error(err),
    }),
    new transports.Console({
      format: format.combine(format.simple(), format.colorize()),
    }),
  ],
});

logger.info(`app start ${process.env.NODE_ENV}`);

app.use(
  morgan("combined", {
    stream: {
      write: (message) => {
        logger.info(message);
      },
    },
  })
);

app.delete("/clear", async (req, res, next) => {
  try {
    const fetch = await deleteData(req.query.id);
    if(fetch){
      res.json({
            body: "cleared data",
          });
    }
    else{
      logger.error(jsonres);
      res.status(fetch).json(jsonres);
    }
  } catch (err) {
    next(err);
  }
});

app.post("/add", async (req, res, next) => {
  try {
    const count = validateAndFormat(req.body);
    res.json({
      body: `added ${count} points`,
    });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  logger.rejections(err.message);
  return res.status(err.statusCode || 400).json({
    error: err.message,
  });
});

process.on("uncaughtException", (err) => {
  logger.error("error", err.message, {
    label: "uncaught",
  });
  logger.info("app exit");
  console.error(err);
  process.exit(1);
});

app.listen(process.env.PORT, () =>
  logger.info(`listining at ${process.env.PORT}`)
);

// .env
// one desc to function routes
// root define and function
//
