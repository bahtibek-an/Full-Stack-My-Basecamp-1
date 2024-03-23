const express = require("express");
const app = express();
const Mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path")
require("dotenv").config()
const cookies = require("cookie-parser")
const bcrypt = require('bcrypt');
const expressSession = require("express-session")
const port = 3400;

const userModel = require("./model/userModel")
const {SignupPage , formPage, HomePage , loginPage, deleteAccount, adminPage , userEdit, logout, newProject, allProjects, comments, deletProject, setting} = require("../controller/userGetController")
const { login,signup ,deleteuser, userEditPost, userDeletePost, addProject, addComments, updateProject} = require("../controller/postController");

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cookies())
app.use(
    expressSession({
      secret: "secret key",
      cookie: {},
      resave: false,
      saveUninitialized: false,
    })
);


app.get("/", formPage);
app.get("/signup", SignupPage);
app.get("/home", HomePage);
app.get("/login", loginPage);
app.get("/delete", deleteAccount);
app.get("/admin", adminPage);
app.get("/logout",logout);
app.get('/users/:userId/edit', userEdit);
app.get('/newProject', newProject);
app.get("/getAllProjects", allProjects);
app.get("/comments/:id", comments);
app.get("/delete/project/:id", deletProject);
app.get("/setting/projectSetting/:id", setting);
app.post("/signup", signup);
app.post("/login", login);
app.post("/deleteuser", deleteuser);
app.post("/addProject", addProject);
app.post('/users/:userId/edit', userEditPost);
app.post('/users/:userId/delete', userDeletePost);
app.post("/addComment/:id", addComments);
app.post("/update/project", updateProject);


app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})
