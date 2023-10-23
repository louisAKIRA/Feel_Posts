const express = require("express");
const db = require("../db");
const dayjs = require("dayjs");
const router = express.Router();

router.get("/", async (req, res) => {
  //   console.log(req.query);
  //   const { q, sortBy } = req.query;
  let allPosts = [];
  try {
    allPosts = await db
      .select("post.id", "post.title", "post.form", "post.createdAt")
      .count("comment.id as commentsCount")
      .from("post")
      .leftJoin("comment", "post.id", "comment.postId")
      .groupBy("post.id")
      .orderBy("post.id", "desc");
    allPosts = allPosts.map((post) => {
      const createdAtText = dayjs(post.createdAt).format(
        "DD / MMM / YYYY - HH:mm"
      );
      return { ...post, createdAtText };
    });
  } catch (error) {
    console.error(error);
  }
  res.render("home", { allPosts });
});

module.exports = router;
