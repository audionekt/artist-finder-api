export interface IConfig {
  server_port: number;
  redis: {
    host: string;
    port: number;
  };
}
