import dotenv from 'dotenv';
import { get } from 'env-var';

dotenv.config();

export const envs = {
  // Hace un cast a number del valor que viene en la variable de entorno
  PORT: get('PORT').required().asPortNumber(),
  
  // * Variables de entorno de jwt
  JWT_SEED: get('JWT_SEED').required().asString(),

  // * Variables de entorno de nodemailer
  SEND_EMAIL: get('SEND_EMAIL').default('false').asBool(),
  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),

  // * Variables de entorno de paypal
  PAYPAL_CLIENT_ID: get('PAYPAL_CLIENT_ID').required().asString(),
  PAYPAL_SECRET_KEY: get('PAYPAL_SECRET').required().asString(),
  PAYPAL_API: get('PAYPAL_API').required().asString(),

  WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),
}