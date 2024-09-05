import { EnvironmentConfiguration } from './config.model';

export const loadEnvironmentConfig = (): EnvironmentConfiguration => {
  return {
    database: {
      name: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
    },
    listeningPort: +process.env.LISTENING_PORT,
    jwtSecret: process.env.JWT_SECRET,
    s3Config: {
      accessKey: process.env.S3_ACCESS_KEY,
      bucket: process.env.S3_BUCKET_NAME,
      region: process.env.S3_REGION,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  };
};
