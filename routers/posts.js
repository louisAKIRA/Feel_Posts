const express = require("express");
const dayjs = require("dayjs");
const db = require("../db");

const router = express.Router();

async function getPostAndComments(postID) {
  let onePost = null;
  let postComments = [];
  try {
    // Get one post
    const somePosts = await db.select("*").from("post").where("id", +postID);
    onePost = somePosts[0];
    onePost.createdAtText = dayjs(onePost.createdAt).format(
      "DD / MMM / YYYY - HH:mm"
    );

    // Get post comment
    postComments = await db
      .select("*")
      .from("comment")
      .where("postId", +postID)
      .orderBy("comment.id", "desc");
    postComments = postComments.map((comment) => {
      const createdAtText = dayjs(comment.createdAt).format(
        "DD / MMM / YYYY - HH:mm"
      );
      return { ...comment, createdAtText };
    });
  } catch (error) {
    console.error(error);
  }
  // const onePost = allPosts.find((port) => port.id === +postID);
  const customTitle = !!onePost ? `${onePost.title} | ` : "ไม่พบเนื่อหา | ";
  return { onePost, postComments, customTitle };
}

router.get("/new", (req, res) => {
  res.render("postNew");
});

router.post("/new", async (req, res) => {
  const { title, content, form, accepted } = req.body ?? {};

  try {
    //Validation
    if (!title || !content || !form) {
      throw new Error("no text");
    } else if (accepted != "on") {
      throw new Error("no accepted");
    }

    //Create Post
    await db
      .insert({ title, content, form, createdAt: new Date() })
      .into("post");
  } catch (error) {
    console.error(error);
    let errorMessage = "ผิดพลาดอะไรสักอย่าง";
    if (error.message === "no text") {
      errorMessage = "ผิดที่ไปใส่ข้อความไง ไอ้โง่ววววว";
    } else if (error.message === "no accepted") {
      errorMessage = "ไม่ได้ยอมรับไง ไอ้โง่วววว";
    }
    return res.render("postNew", {
      errorMessage,
      values: { title, content, form },
    });
  }
  res.redirect("/p/new/done");
});

router.get("/new/done", (req, res) => {
  res.render("postNewDone");
});

router.get("/:postID", async (req, res) => {
  // console.log(req.params);
  // console.log(postID);
  const { postID } = req.params;
  const postData = await getPostAndComments(postID);
  res.render("postId", postData);
});

router.post("/:postID/comment", async (req, res) => {
  const { postID } = req.params;
  const { content, form, accepted } = req.body ?? {};

  try {
    //Validation
    if (!content || !form) {
      throw new Error("no text");
    } else if (accepted != "on") {
      throw new Error("no accepted");
    }

    //Create Comment
    await db
      .insert({ content, form, createdAt: new Date(), postId: +postID })
      .into("comment");
  } catch (error) {
    console.error(error);
    let errorMessage = "ผิดพลาดอะไรสักอย่าง";
    if (error.message === "no text") {
      errorMessage = "ผิดที่ไปใส่ข้อความไง ไอ้โง่ววววว";
    } else if (error.message === "no accepted") {
      errorMessage = "ไม่ได้ยอมรับไง ไอ้โง่วววว";
    }
    const postData = await getPostAndComments(postID);
    return res.render("postId", {
      ...postData,
      errorMessage,
      values: { content, form },
    });
  }
  res.redirect(`/p/${postID}`);
});

module.exports = router;
