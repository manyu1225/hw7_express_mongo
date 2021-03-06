const express = require("express");
const appError = require("../service/appError");
const handleSuccess = require("../service/handleSuccess");
const sizeOf = require("image-size");
const { ImgurClient } = require("imgur");
const handleErrorAsync = require("../service/handleErrorAsync");
const httpStatus = require("../utils/httpStatus");

const UploadController = {
  async uploadFile(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
      if (!req.files.length) {
        return appError(httpStatus.BAD_REQUES, "尚未上傳檔案", next);
      }
      const dimensions = sizeOf(req.files[0].buffer);
      if (dimensions.width !== dimensions.height) {
        return appError(
          httpStatus.BAD_REQUES,
          "圖片長寬不符合 1:1 尺寸。",
          next
        );
      }
      const client = new ImgurClient({
        clientId: process.env.IMGUR_CLIENT_ID,
        clientSecret: process.env.IMGUR_CLIENT_SECRET,
        refreshToken: process.env.IMGUR_REFRESH_TOKEN,
      });
      const response = await client.upload({
        image: req.files[0].buffer.toString("base64"),
        type: "base64",
        album: process.env.IMGUR_ALBUM_ID,
      });
      handleSuccess(res, httpStatus.OK, response.data.link);
    })(req, res, next);
  },
};
module.exports = UploadController;
