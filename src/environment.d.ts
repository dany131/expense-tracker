declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Application
      ENVIRONMENT: "development" | "production";
      PORT: string;

      MONGO_DB_URI: string;
      MONGO_DB_NAME: string;

      APP_NAME: string;
      APP_URL: string;
      ADMIN_URL: string;
      AT_KEY: string;
      AT_EXPIRY: string;
      RT_KEY: string;
      RT_EXPIRY: string;
      API_KEY: string;
      APP_PREFIX: string;
      DOCS_PREFIX: string;
      SWAGGER_AUTH_USER: string;
      SWAGGER_AUTH_PASS: string;

      // Mail
      EMAIL_HOST: string;
      EMAIL_PORT: string;
      EMAIL_USER: string;
      EMAIL_PASS: string;

      // Storage
      STORAGE_PROVIDER: "aws" | "local";
      STORAGE_PATH: string;
      STORAGE_ACCESS_KEY: string;
      STORAGE_SECRET_ACCESS_KEY: string;
      STORAGE_S3_BUCKET_NAME: string;
      STORAGE_S3_REGION: string;
    }
  }
}

export {};
