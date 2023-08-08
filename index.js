const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

let port = "4500";
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// db
const { sequelize } = require("./model/db.model");
// middleware
const { authentication } = require("./middleware/authentication.midleware");
// routes
const { userRouter } = require("./routes/user.route");
const { blogPRRouter } = require("./routes/blogPR.route");
const { blogRouter } = require("./routes/blogs.route");

// Initial route
app.get("/", (req, res) => {
  res.send({ msg: "Welcome to blogApp" });
});

app.use("/user", userRouter);
app.use(blogRouter);
app.use(authentication);
app.use("/blog", blogPRRouter);

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log("server is rocking at port", port);
  });
});
