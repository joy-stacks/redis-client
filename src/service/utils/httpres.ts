/*
 * @Author: JOY
 * @Date: 2024-05-22 16:19:26
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-20 13:54:42
 * @Description: http请求帮助
 */
import { Response } from "../middleware/interceptor/index.interceptor";

export enum ResponseStatus {
  Success = 1,
  Failed = 0,
  UnAutoriztion = 403,
  NotFound = 404,
  InternalError = 500,
  GroupNameIsNotEmpty = 10001,
  GroupNameIsExist = 10002
}

const mapData: Iterable<[ResponseStatus, string]> = [
  [ResponseStatus.Success, "success"],
  [ResponseStatus.Failed, "fail"],
  [ResponseStatus.UnAutoriztion, "无权限访问"],
  [ResponseStatus.NotFound, "接口不存在"],
  [ResponseStatus.InternalError, "服务内部错误"],
  [ResponseStatus.GroupNameIsNotEmpty, "组名称不能为空"],
  [ResponseStatus.GroupNameIsExist, "组已存在"],
];

const map = new Map<ResponseStatus, string>(mapData);

/**
 * 根据错误代码获取信息
 * @param status
 * @returns
 */
function getMessage(status: ResponseStatus) {
  return map.get(status) ?? "";
}

/**
 * 成功返回
 * @param data
 * @returns
 */
export function success<T>(data: T): Response<T> {
  const code = ResponseStatus.Success;
  const msg = getMessage(code);

  return {
    code,
    msg,
    desc: "",
    data: data || null,
  };
}

/**
 * 失败返回
 * @param code
 * @param desc
 * @returns
 */
export function fail<T>(code: ResponseStatus, desc?: string): Response<T> {
  let msg = getMessage(code);
  // 错误信息替换
  if (desc) {
    msg = msg.replace("{0}", `:${desc}`);
  }
  return {
    code,
    msg,
    desc: desc || "",
    data: null,
  };
}
