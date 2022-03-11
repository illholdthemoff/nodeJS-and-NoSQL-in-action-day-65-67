const express = require("express");
const { route } = require("express/lib/application");
const mongodb = require("mongodb");

const db = require("../data/database"); // requiring database

const ObjectId = mongodb.ObjectId;

const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
  const posts = await db
    .getDb()
    .collection("posts")
    .find({})
    .project({ title: 1, summary: 1, "author.name": 1 })
    .toArray();
  res.render("posts-list", { posts: posts });
});

router.get("/new-post", async function (req, res) {
  const authors = await db.getDb().collection("authors").find().toArray(); // establishes connection to authors document in db, also returns a promise, in the form of an array.
  res.render("create-post", { authors: authors }); //remember, right refers to the const, left is an arbitrary key name
});

router.post("/posts", async function (req, res) {
  const authorId = new ObjectId(req.body.author); //body.author is used here, because the value in the author select is the id. we use the ObjectId to store it as an ObjectId that mongo uses internally for storing Ids, rather than as a plain string
  const author = await db
    .getDb()
    .collection("authors")
    .findOne({ _id: authorId }); // so that we can get the author name without actually having it on the page, like how it is below for the summary, body etc etc

  const newPost = {
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.content,
    date: new Date(),
    author: {
      id: authorId, //again, grabbed from the cosnt above
      name: author.name, //from author document, fetching name.
      email: author.email,
    },
  };

  const result = await db.getDb().collection("posts").insertOne(newPost); // async because again this might not happen immedaitely
  console.log(result);
  res.redirect("/posts");
});

router.get("/posts/:id", async function (req, res, next) {
  let postId = req.params.id;

  try {
    postId = new ObjectId(postId);
  } catch (error) {
    // return next(error);
    res.render("404");
  }

  const post = await db
    .getDb()
    .collection("posts")
    .findOne({ _id: postId }, { summary: 0 }); //remeber, find basically always means async. Excluding summary because we dont need it on the page to display the blog post itself

  if (!post) {
    return res.status(404).render("404");
  }

  post.humanReadableDate = post.date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }); // converting the date to be more readable
  post.date = post.date.toISOString();

  res.render("post-detail", { post: post });
});

router.get("/posts/:id/edit", async function (req, res) {
  const postId = req.params.id;
  const post = await db
    .getDb()
    .collection("posts")
    .findOne({ _id: new ObjectId(postId) }, { title: 1, summary: 1, body: 1 });

  if (!post) {
    return res.status(404).render("404");
  }

  res.render("update-post", { post: post });
});

router.post("/posts/:id/edit", async function (req, res) {
  const postId = new ObjectId(req.params.id);
  const result = await db
    .getDb()
    .collection("posts")
    .updateOne(
      { _id: postId },
      {
        $set: {
          title: req.body.title,
          summary: req.body.summary,
          body: req.body.content,
          // date: new Date()
        },
      }
    );

  res.redirect("/posts");
});

router.post("/posts/:id/delete", async function (req, res) {
  const postId = new ObjectId(req.params.id);
  const result = await db
    .getDb()
    .collection("posts")
    .deleteOne({ _id: postId });

  res.redirect("/posts");
});

module.exports = router;
