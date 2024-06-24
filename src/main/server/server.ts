/*
 * @Author: JOY
 * @Date: 2024-06-21 10:50:17
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-24 15:02:27
 * @Description: 
 */
import express from "express";
import parser from "body-parser";

import router from "./router";

const app = express();

app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  );
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == "options") res.send(200); //让options尝试请求快速结束
  else next();
});

app.use(
  parser.urlencoded({
    extended: true,
  })
);
app.use(parser.json());

app.use("/v1", router);
console.log(router.route('/v1'))
export const server = app.listen(3000, () => {
  console.log("server listening on port 3000");
});
