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
  group_pid: string;
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
 * 修改分组
 * @param param
 * @returns
 */
export const postGroupEdit = <T>(param: {
  group_name: string;
  group_id: string;
  group_pid: string;
}): Promise<Response<T>> => {
  return new Promise((resolve, reject) => {
    request
      .post("/v1/sys/group/edit", param)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
};

/**
 * 删除分组
 * @param param
 * @returns
 */
export const postGroupDel = <T>(param: { group_id: string }): Promise<Response<T>> => {
  return new Promise((resolve, reject) => {
    request
      .delete("/v1/sys/group/del", {
        data: param,
      })
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
