// protected blog route
const express = require("express");
const multer = require("multer");
const path = require("path");

const { blog } = require("../model/db.model");

const blogPRRouter = express.Router();

// setting up multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// posting blog
blogPRRouter.post("/post", upload.single("image"), async (req, res) => {
  let payload = req.body;
  payload.author_id = payload.userID;
  payload.image = req.file.filename;
  console.log(req.file, req.body);
  try {
    const data = await blog.create(payload);
    res.status(201).send({ msg: "blog posted", data });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "something went wrong", error: error });
  }
});

// gatting blogs data of a user
blogPRRouter.get("/authorblogs/:authorID", async (req, res) => {
  let author_id = req.params.authorID;
  try {
    const authorBlogData = await blog.findAll({ where: { author_id } });
    res.status(200).send(authorBlogData);
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "something went wrong", error: error });
  }
});

// deleting blog data
blogPRRouter.delete("/deleteblog/:blogid", async (req, res) => {
  let author_id = req.body.userID;
  console.log(author_id);
  let blogid = req.params.blogid;
  try {
    const blogData = await blog.findOne({ where: { id: blogid } });
    if (blogData.author_id == author_id) {
      await blogData.destroy();
      res.status(200).send({ msg: "deleted" });
    } else {
      res.status(400).send({ msg: "Not Authorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "something went wrong", error: error });
  }
});

// update post
blogPRRouter.patch("/updateblog/:blogid", async (req, res) => {
  let author_id = req.body.userID;
  let payload = req.body;
  console.log(author_id);
  let blogid = req.params.blogid;
  try {
    const blogData = await blog.findOne({ where: { id: blogid } });
    if (blogData.author_id == author_id) {
      try {
        await blog.update(payload, { where: { id: blogid } });
        res.status(200).send({ msg: "updated" });
      } catch {
        console.log(error);
        res.status(400).send({ msg: "something went wrong", error: error });
      }
    } else {
      res.status(400).send({ msg: "Not Authorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "something went wrong", error: error });
  }
});
module.exports = { blogPRRouter };
