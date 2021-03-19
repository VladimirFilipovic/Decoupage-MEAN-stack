const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require ("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");


const router = express.Router();

const User = require("../models/user");

router.get("", (req, res, next) => {
  User.find().then(documents => {
    console.log(documents)
    res.status(200).json({
      message: "Posts fetched successfully!",
      users: documents
    });
  });
});

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      username: req.body.username,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User saved",
          user: {
            id: result.id,
            username: result.username,
            password: result.password
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { username: fetchedUser.username, userId: fetchedUser._id },
        "izgubio-sam-papuce",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});

router.put("/:id", (req, res, next) => {
  console.log('pozvan sam');

  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      _id: req.body.id,
      username: req.body.username,
      password: hash
    });
    fetchedUser=user;
  User.updateOne({ _id: req.params.id }, user).then(result => {
    console.log(result);
    res.status(200).json({ message: "Update successful!" });
  }).catch(err => {
    return res.status(401).json({
      message: "Auth failed"
    });
  });

  })
  .catch(err => {
    console.log('greska bato' + req.body.password);
    return res.status(401).json({
      message: err
    });
});
});

router.delete("/:id",(req, res, next) => {
  User.deleteOne({ _id: req.params.id }).then(
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

module.exports = router;
