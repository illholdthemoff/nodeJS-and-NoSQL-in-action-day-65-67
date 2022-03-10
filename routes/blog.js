const express = require("express");
const mongodb = require("mongodb");

const db = require("../data/database"); // requiring database

const ObjectId = mongodb.ObjectId;

const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
  const posts = await db.getDb.collection("post").find({}, {title: 1, summary: 1, "author.name": 1 }).toArray();
  res.render("posts-list", {posts: posts});
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

module.exports = router;
