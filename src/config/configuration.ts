export default () => ({
  environment: process.env.ENVIRONMENT,
  port: parseInt(process.env.PORT, 10) || 3000,
  mongo: { uri: process.env.MONGO_DB_URI, db: process.env.MONGO_DB_NAME },
  app: {
    name: process.env.APP_NAME,
    url: process.env.APP_URL,
    adminUrl: process.env.ADMIN_URL,
    prefix: process.env.APP_PREFIX,
    docsPrefix: process.env.DOCS_PREFIX,
    swaggerAuthUser: process.env.SWAGGER_AUTH_USER,
    swaggerAuthPassword: process.env.SWAGGER_AUTH_PASS
  },
  jwt: {
    accessTokenKey: process.env.AT_KEY,
    accessExpiry: process.env.AT_EXPIRY,
    refreshTokenKey: process.env.RT_KEY,
    refreshExpiry: process.env.RT_EXPIRY
  },
  mailing: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  storage: {
    provider: process.env.STORAGE_PROVIDER,
    path: process.env.STORAGE_PATH,
    accessKey: process.env.STORAGE_ACCESS_KEY,
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY,
    name: process.env.STORAGE_S3_BUCKET_NAME,
    region: process.env.STORAGE_S3_REGION
  }

});