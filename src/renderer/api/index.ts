import request from "../utils/request";

interface Response<T> {
  code: number;
  msg: string;
  data: T;
}
/**
 * 新增分组
 * @param param
 * @returns
 */
export const postGroupAdd = <T>(param: {
  group_name: string;
  group_id: string;
}): Promise<Response<T>> => {
  return new Promise((resolve, reject) => {
    request
      .post("/v1/sys/group/add", param)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
};

/**
 * 获取所有的连接
 * @returns
 */
export const getLinks = <T>(): Promise<Response<T>> => {
  return new Promise((resolve, reject) => {
    request
      .get("/v1/sys/links")
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
};
