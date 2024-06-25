/*
 * @Author: JOY
 * @Date: 2024-06-21 11:29:23
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-25 09:41:55
 * @Description: 
 */
export interface Link {
  id: number;
  pid: number;
  name: string;
  // 1-组 2-连接
  type: string;
  host: string;
  user: string;
  pwd: string;
  port: number;
  ltype: string;
}
