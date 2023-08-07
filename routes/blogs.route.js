const express = require("express");

const { blog } = require("../model/db.model");

const blogRouter = express.Router();

// getting all blogs
blogRouter.get("/blog", async (req, res) => {
  try {
    const blogs = await blog.findAll();
    res.status(200).send(blogs);
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "something went wrong", error: error });
  }
});

// get blog by id
blogRouter.get("/blog/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const blogData = await blog.findOne({ where: { id } });
    res.status(200).send(blogData);
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "something went wrong", error: error });
  }
});

module.exports = { blogRouter };
