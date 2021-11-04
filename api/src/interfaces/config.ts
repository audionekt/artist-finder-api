export interface IConfig {
  server_port: number;
  database: {
    name: string;
    admin: string;
    password: string;
    email: string;
    default_password: string;
  };
  redis: {
    host: string;
    port: number;
  };
}
