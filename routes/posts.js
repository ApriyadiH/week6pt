const express = require('express');
const Posts = require("../schemas/post");
const router = express.Router();

// 1. Write Posts
router.post("/posts", async (req, res) => {
  const { user, password, title, content } = req.body;
  let createdAt = new Date();

  await Posts.create({ title, user, password, content, createdAt  });

  res.json({ 
    message: "A post has been created" 
  });
});

// 2. Search Posts
router.get("/posts", async (req, res) => {
  const all_posts = await Posts.find();
  
  const results = all_posts.map((post) => {
		return {
      postId: post._id,
      user: post.user,
			title: post.title,
      createdAt: post.createdAt
		};
  });

  const results_sorted = results.sort((a,b)=>{
    return b.createdAt - a.createdAt
  });

  res.json({
    data: results_sorted,
  });
});

// 3. Search Post Details
router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const specific_post = await Posts.find({_id: postId});

  const results = {
      postId,
      user: specific_post[0].user,
			title: specific_post[0].title,
      content: specific_post[0].content,
      createdAt: specific_post[0].createdAt
		};

  res.json({
    data: results,
  });
});

// 4. Edit Post
router.put("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const { title, password, content } = req.body;
  const specific_post = await Posts.find({_id: postId});

  if (specific_post[0].password === password) {
    await Posts.updateOne({ _id: postId }, { $set: { title, password, content } });
    res.json({
      message: "Your post has been modified",
    });
  } else {
    res.json({
      message: "failed, wrong password.",
    });
  }
});

// 5. Delete Post
router.delete("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;
  const specific_post = await Posts.find({_id: postId});

  if (specific_post[0].password === password) {
    await Posts.deleteOne({ _id: postId });
    res.json({
      message: "The post was deleted",
    });
  } else {
    res.json({
      message: "failed, wrong password.",
    });
  }
});

module.exports = router;