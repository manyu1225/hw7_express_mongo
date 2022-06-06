const handleErrorAsync = require("../service/handleErrorAsync");
const appError = require("../service/appError");
const httpStatus = require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");
const postsModel = require("../models/Post");
const postsController = {
  async getPostsbyContent(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
      const timeSort = req.query.s === "asc" ? "createAt" : "-createAt";
      // const limit = req.query.limit;
      const q =
        req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
      const data = await postsModel
        .find(q)
        .populate({ path: "user", select: "name photo" })
        .sort(timeSort);
      // const all = await postsModel.find().sort(timeSort).limit(limit);
      handleSuccess(res, httpStatus.OK, data);
    })(req, res, next);
  },
  async getPosts(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
      const id = req.params.id;
      const data = await postsModel.findById(id).populate({
        path: "user",
        select: "name photo",
      });
      if (!data) {
        return appError(httpStatus.BAD_REQUES, "id 不存在", next);
      }
      handleSuccess(res, httpStatus.OK, data);
    })(req, res, next);
  },
  async createPosts(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
      const data = req.body;
      let { tags, type, content } = data; //解構
      if (!type || !tags || !content) {
        return appError(httpStatus.BAD_REQUEST, "請確認欄位", next);
      }
      const newUser = await postsModel.create(data);
      handleSuccess(res, httpStatus.OK, newUser);
    })(req, res, next);
  },
  async updatePosts(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
      const id = req.params.id;
      const data = req.body;
      if (!data) {
        return appError(httpStatus.BAD_REQUEST, "不可為空物件", next);
      }
      const updPost = await postsModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      if (!updPost) {
        return appError(httpStatus.BAD_REQUEST, "無此ID", next);
      } else {
        handleSuccess(res, httpStatus.OK, updPost);
      }
    })(req, res, next);
  },
  async deletePosts(req, res, next) {
    handleErrorAsync(async (req, res, next) => {
      const id = req.params.id;
      const data = await postsModel.findByIdAndDelete(id);
      if (!data) {
        return appError(httpStatus.BAD_REQUEST, "無此ID", next);
      }
      handleSuccess(res, httpStatus.OK, data);
    })(req, res, next);
  },
};
module.exports = postsController;
