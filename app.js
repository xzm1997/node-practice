const express = require("express");
const async = require("async");
const axios = require("axios");

const app = express();
app.use("/public", express.static("public"));

const url = "https://www.yuanfudao.com";
const limitCount = 3;
let requestCount = 0;

const asyncPool = async (poolLimit, iteratorFn, param) => {
  // 限制数量、数据数组、处理函数
  const resultList = [];
  const executing = [];
  while (true) {
    const p = Promise.resolve().then(() => {
      return iteratorFn(param);
    });
    resultList.push(p);
    const e = p.then(() => {
      return executing.splice(executing.indexOf(e), 1);
    });
    executing.push(e);
    if (executing.length >= poolLimit) {
      await Promise.race(executing);
      console.log("进行下一请求")
    }
  }
};

const getRequest = (url) => {
  axios.get(url)
};

const main = async () => {
  await asyncPool(limitCount, getRequest, url);
};

main();
