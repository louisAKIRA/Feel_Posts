const express = require("express");
const hbs = require("hbs");
const generalRouter = require("./routers/general");
const postRouter = require("./routers/posts");
const app = express();
const port = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");
app.use("/static", express.static("static"));

app.use("/", generalRouter);
app.use("/p", postRouter);

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
