const express = require("express");
const Post = require("../models/post");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const User = require("../models/user");

const router = express.Router();
/*Use the express.Router class to create modular, mountable route handlers. A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”.

The following example creates a router as a module, loads a middleware function in it, defines some routes, and mounts the router module on a path in the main app.*/
//where moletr shoukl but files

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
      comments: [],
      commentators:[]

    });
    post.save().then(createdPost => {
      console.log(createdPost.title, createdPost.imagePath);


      res.status(201).json({
        message: "Post added successfully",
        post: {
          id: createdPost.id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath,
          creator : createdPost.creator,
          comments: createdPost.comments,
          commentators: createdPost.commentators
        }
      });
    });
  }
);

router.get("", (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });
});

//express sam executuje middleware kad requst stigne do njega

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    var likedBy = [];
    var dislikedBy=[];
    var comments=[];
    var commentators=[];
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    Post.findOne({ _id: req.params.id}).then(oldPost =>{
      likedBy=[...oldPost.likedBy];
      dislikedBy= [...oldPost.dislikedBy];
      comments = [...oldPost.comments];
      commentators= [...oldPost.commentators];
    console.log('Pri updatovanju likedby je findOne'+ comments[0]);
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId,
      likedBy: likedBy,
      dislikedBy: dislikedBy,
      likes:req.body.likes,
      dislikes: req.body.dislikes,
      comments: comments,
      commentators: commentators
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
      .then(result => {
        if (result.nModified > 0) {
          res.status(200).json({ message: imagePath });
        } else {
          res.status(401).json({ message: "Not authorized!" });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Couldn't udpate post!"
        });
      });

    });
  }
);

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    }
  );
});

router.delete("/admin/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

router.put(
  "/admin/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    var likedBy = [];
    var dislikedBy=[];
    var comments=[];
    var commentators=[];
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    Post.findOne({ _id: req.params.id}).then(oldPost =>{
      likedBy=[...oldPost.likedBy];
      dislikedBy= [...oldPost.dislikedBy];
      comments = [...oldPost.comments];
      commentators= [...oldPost.commentators];

      const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        dislikedBy:dislikedBy,
        likedBy:likedBy,
        likes:req.body.likes,
        dislikes: req.body.dislikes,
        comments: comments,
        commentators: commentators
      });
      console.log(post);
      Post.updateOne({ _id: req.params.id }, post).then(result => {
        res.status(200).json({ message: imagePath });
      });
    });

  }
);

router.put('/like/:id',checkAuth, (req, res) => {
  // Check if id was passed provided in request body
  if (!req.params.id) {
    res.json({ success: false, message: 'No id was provided.' }); // Return error message
  } else {
    // Search the database with id
    Post.findOne({ _id: req.params.id }, (err, post) => {
      // Check if error was encountered
      if (err) {
        res.json({ success: false, message: 'Invalid blog id' }); // Return error message
      } else {
        // Check if id matched the id of a blog post in the database
        if (!post) {
          res.json({ success: false, message: 'That blog was not found.' }); // Return error message
        } else {
          // Get data from user that is signed in
          User.findOne({ username: req.userData.username }, (err, user) => {
            // Check if error was found
            if (err) {
              res.json({ success: false, message: 'Something went wrong.' }); // Return error message
            } else {
              // Check if id of user in session was found in the database
              if (!user) {
                res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
              } else {
                // Check if user who liked post is the same user that originally created the blog post
                if (user.id === post.creator) {
                  res.json({ success: false, messagse: 'Cannot like your own post.' }); // Return error message
                } else {
                  // Check if the user who liked the post has already liked the blog post before
                  if (post.likedBy.includes(user.username)) {
                    res.json({ success: false, message: 'You already liked this post.' }); // Return error message
                  } else {
                    // Check if user who liked post has previously disliked a post
                    if (post.dislikedBy.includes(user.username)) {
                      post.dislikes--; // Reduce the total number of dislikes
                      const arrayIndex = post.dislikedBy.indexOf(user.username); // Get the index of the username in the array for removal
                      post.dislikedBy.splice(arrayIndex, 1); // Remove user from array
                      post.likes++; // Increment likes
                      post.likedBy.push(user.username); // Add username to the array of likedBy array
                      // Save blog post data
                      post.save((err) => {
                        // Check if error was found
                        if (err) {
                          res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                        } else {
                          res.json({ success: true, message: 'Blog liked!',post:{likes:post.likes,dislikes:post.dislikes} }); // Return success message
                        }
                      });
                    } else {
                      post.likes++; // Incriment likes
                      post.likedBy.push(user.username); // Add liker's username into array of likedBy
                      // Save blog post
                      post.save((err) => {
                        if (err) {
                          res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                        } else {
                          res.json({ success: true, message: 'Blog liked!' ,post:{likes:post.likes,dislikes:post.dislikes}}); // Return success message
                        }
                      });
                    }
                  }
                }
              }
            }
          });
        }
      }
    });
  }
});

router.put('/dislike/:id',checkAuth, (req, res) => {
  // Check if id was passed provided in request body
  if (!req.params.id) {
    res.json({ success: false, message: 'No id was provided.' }); // Return error message
  } else {
    // Search the database with id
    Post.findOne({ _id: req.params.id }, (err, post) => {
      // Check if error was encountered
      if (err) {
        res.json({ success: false, message: 'Invalid blog id' }); // Return error message
      } else {
        // Check if id matched the id of a blog post in the database
        if (!post) {
          res.json({ success: false, message: 'That blog was not found.' }); // Return error message
        } else {
          // Get data from user that is signed in
          User.findOne({ _id: req.userData.userId }, (err, user) => {
            // Check if error was found
            if (err) {
              res.json({ success: false, message: 'Something went wrong.' }); // Return error message
            } else {
              // Check if id of user in session was found in the database
              if (!user) {
                res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
              } else {
                // Check if user who liked post is the same user that originally created the blog post
                if (user.id === post.creator) {
                  res.json({ success: false, messagse: 'Cannot like your own post.' }); // Return error message
                } else {
                  // Check if the user who liked the post has already liked the blog post before
                  if (post.dislikedBy.includes(user.username)) {
                    res.json({ success: false, message: 'You already disliked this post.' }); // Return error message
                  } else {
                    // Check if user who liked post has previously disliked a post
                    if (post.likedBy.includes(user.username)) {
                      post.likes--; // Reduce the total number of dislikes
                      const arrayIndex = post.likedBy.indexOf(user.username); // Get the index of the username in the array for removal
                      post.likedBy.splice(arrayIndex, 1); // Remove user from array
                      post.dislikes++; // Increment likes
                      post.dislikedBy.push(user.username); // Add username to the array of likedBy array
                      // Save blog post data
                      post.save((err) => {
                        // Check if error was found
                        if (err) {
                          res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                        } else {
                          res.json({ success: true, message: 'Blog disliked!',post:{likes:post.likes,dislikes:post.dislikes} }); // Return success message
                        }
                      });
                    } else {
                      post.dislikes++; // Incriment likes
                      post.dislikedBy.push(user.username); // Add liker's username into array of likedBy
                      // Save blog post
                      post.save((err) => {
                        if (err) {
                          res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                        } else {
                          res.json({ success: true, message: 'Blog disliked!',post:{likes:post.likes,dislikes:post.dislikes} }); // Return success message
                        }
                      });
                    }
                  }
                }
              }
            }
          });
        }
      }
    });
  }
});

router.post('/comment/:id',checkAuth,multer({ storage: storage }).single("image"), (req, res) => {
  if (!req.body.comment) {
    res.json({ success: false, message: 'No comment provided' }); // Return error message
  } else {
    // Check if id was provided in request body
    if (!req.params.id) {
      res.json({ success: false, message: 'No id was provided' }); // Return error message
    } else {
      // Use id to search for blog post in database
      Post.findOne({ _id: req.params.id }, (err, post) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Invalid blog id' }); // Return error message
        } else {
          // Check if id matched the id of any blog post in the database
          if (!post) {
            res.json({ success: false, message: 'Blog not found.' }); // Return error message
          } else {
            // Grab data of user that is logged in
            User.findOne({ username: req.userData.username }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: 'Something went wrong' }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'User not found.' }); // Return error message
                } else {
                  // Add the new comment to the blog post's array
                  post.comments.push(req.body.comment); // Comment field
                  console.log(post.comments[0]);
                  post.commentators.push(user.username);
                  // Save blog post
                  post.save((err) => {
                    // Check if error was found
                    if (err) {
                      res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                    } else {
                      res.json({ success: true, message: 'Comment saved',commenter:user.username }); // Return success message
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  }
});

module.exports = router;
