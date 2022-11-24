const express = require('express');
const Comments = require("../schemas/comment");
const router = express.Router();

// 6. Write Comments
router.post("/comments/:postId", async (req, res) => {
  const { postId } = req.params;
  const { user, password, content } = req.body;
  let createdAt = new Date();

  if (content.trim()===""){
    res.json({ 
      message: "Please enter the comment content" 
    });
  } else {
    await Comments.create({ postId, user, password, content, createdAt });
    res.json({ 
      message: "Comment created"
    });
  }
});

// 7. Search Comment List
router.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;
  const specific_comments = await Comments.find({postId});
  
  const results = specific_comments.map((comment) => {
		return {
      commentId: comment._id,
      user: comment.user,
			content: comment.content,
      createdAt: comment.createdAt
		};
  });

  const results_sorted = results.sort((a,b)=>{
    return b.createdAt - a.createdAt
  });

  res.json({
    data: results_sorted,
  });
});

// 8. Edit Comments
router.put("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { password, content } = req.body;
  const specific_comment = await Comments.find({_id: commentId});

  if (specific_comment[0].password === password) {
    if (content.trim() != ""){
      await Comments.updateOne({ _id: commentId }, { $set: { content } });
      res.json({
        message: "Your comment has been modified",
      });
    } else {
      res.json({ 
        message: "Please enter the comment content" 
      });
    }
  } else {
    res.json({
      message: "failed, wrong password.",
    });
  }

});

// 9. Delete Comments
router.delete("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { password } = req.body;
  const specific_comment = await Comments.find({_id: commentId});

  if (specific_comment[0].password === password) {
    await Comments.deleteOne({ _id: commentId });
    res.json({
      message: "The comment has been deleted",
    });
  } else {
    res.json({
      message: "failed, wrong password.",
    });
  }
});

module.exports = router;