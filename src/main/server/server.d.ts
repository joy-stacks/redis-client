export interface Link {
  id: number;
  pid: number;
  name: string;
  // 1-组 2-连接
  type: string;
  host: string;
  user: string;
  pwd: string;
  port: string;
}
