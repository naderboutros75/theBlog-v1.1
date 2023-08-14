import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "About Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Contact Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const port = process.env.PORT || 3000;

// creating datbase
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Post = mongoose.model("Post", postSchema);
const theBlogDB = async () => {
  try {
    await mongoose.connect("mongodb://0.0.0.0:27017/blogDB");
    console.log("Connected to database.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  // const posts = await Post.find({});
  res.render("home.ejs", {
    startingContant: homeStartingContent,
    posts: await Post.find({})
  });
});

app.get("/about", (req, res) => {
  res.render("about.ejs", {
    aboutContent: aboutContent
  });
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs", {
    contactContent: contactContent
  });
});

app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});

// saving post to the datbase and go back to home page
app.post("/compose", async (req, res) => {
  await new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  }).save();
  res.redirect("/");
});

// showing the in another page
app.get("/posts/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    res.render("post.ejs", {
      title: post.title,
      content: post.content,
      showenPostId: post._id
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).send("Internal Server Error");
  }
});

// deleting the shown post
app.post("/delete", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.body.postId);
    res.redirect("/");
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, async () => {
  await theBlogDB();
  console.log(`Listing on port ${port}`);
});