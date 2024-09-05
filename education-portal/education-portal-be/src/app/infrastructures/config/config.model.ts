export interface EnvironmentConfiguration {
  database: DatabaseConfiguration;
  listeningPort: number;
  jwtSecret: string;
  s3Config: S3Config;
}

export interface DatabaseConfiguration {
  name: string;
  username: string;
  password: string;
  host: string;
  port: number;
}

export interface S3Config {
  accessKey: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
}
