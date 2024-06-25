/*
 * @Author: JOY
 * @Date: 2024-06-21 11:17:11
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-25 10:28:20
 * @Description:
 */
// 组新增
export interface GroupAddDto {
  group_name: string;
  group_pid: string;
}

// 组修改
export interface GroupEditDto {
  group_name: string;
  group_pid: string;
  group_id: string;
}

// 组删除
export interface GroupDelDto {
  group_id: string;
}

// 连接新增
export interface LinkAddDto {
  name: string;
  gid: string;
  type: string;
  host: string;
  port: string;
  pwd: string;
  user: string;
}

// 测试连接
export interface LinkTestDto {
  type: string;
  host: string;
  port: string;
  pwd: string;
  user: string;
}
