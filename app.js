const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const uploadRouter = require("./routes/upload");
const { resErrorProd, resErrorDev } = require("./service/resError");
require("./utils/connect.js");
const app = express();

process.on("uncaughtException", (err) => {
  console.error("漏洞：Uncaughted Exception");
  console.error(err);
  process.exit(1);
});
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/post", postsRouter);
app.use("/upload", uploadRouter);

app.use(function (req, res, next) {
  next(createError(404)); // 呼叫 next 把控制權轉移到下一個 middleware
});

//錯誤處理的 middleware 相較一般 middleware 會多一個 err 引數
app.use(function (err, req, res, next) {
  // dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "dev") {
    return resErrorDev(err, res);
  }
  if (err.name === "CastError") {
    err.message = "無此 id 資料，請確認後重新輸入！";
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  // production
  if (err.name === "ValidationError") {
    err.message = "資料欄位未填寫正確，請重新輸入！";
    err.isOperational = true;
    return resErrorProd(err, res);
  }
  resErrorProd(err, res);
});

/**
 * 非同步程式/未捕捉到的 catch
 */
process.on("unhandledRejection", (err, promise) => {
  console.error("漏洞：未捕捉到的 rejection：", promise, "原因：", err);
});

module.exports = app;
