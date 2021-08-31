const {
  NODE_ENV: env,
  PORT: port,
  ROW_TO_BE_PROCCESSED: maxRows,
  SMPT_URL: smpt,
  FROM_EMAIL: fromEmail,
  EMAIL_QUEUE: emailQueue,
  FAILURE_QUEUE: failureQueue,
  RABBITMQ_URL: rabbitMqUrl,
  EMAIL_PREFETCH: emailPrefetch,
} = process.env;

// eslint-disable-next-line no-underscore-dangle
export const __prod__ = env === "production";
export const PORT = port ? Number(port) : 4000;
export const MAX_ROWS = maxRows ? Number(maxRows) : 1;
export const SMPT_URL = smpt as string;
export const FROM_EMAIL = fromEmail as string;
export const EMAIL_QUEUE = emailQueue as string;
export const FAILURE_QUEUE = failureQueue as string;
export const RABBITMQ_URL = rabbitMqUrl as string;
export const EMAIL_PREFETCH = emailPrefetch ? Number(emailPrefetch) : 1;
