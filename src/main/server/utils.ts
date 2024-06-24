import { Response } from "express";

export const success = <T>(data: T, res: Response) => {
  return res.send({
    code: 1,
    msg: "",
    data: data,
  });
};

export const fail = (code: number, msg: string, res: Response) => {
  return res.send({
    code,
    msg,
    data: null,
  });
};
