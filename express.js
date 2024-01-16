const express = require("express");
const app = express();
const Mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path")
const multer = require('multer');
const { error } = require("console");
const port = 3300;

const mysql = Mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "PHW#84#jeor",
    database: "my_bascampdb"
})

mysql.connect((err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log(`connect database`);
    }
})

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.status(200).render("index", { title: "form page" })
})

app.get("/signup", (req, res) => {
    res.status(200).render("signup", { title: "Sign up" })
})

app.post('/upload', upload.single('projectFile'), (req, res) => {
    res.send('successful')
});

app.post("/signup", (req, res) => {
    const { username, email, password } = req.body
    const query = `INSERT INTO users (username, email , password) VALUES (?, ? , ?)`
    mysql.query(query, [username, email, password], (err, result) => {
        if (!err) {
            res.status(200).redirect(`/home?username=${encodeURIComponent(username)}`)
        } else {
            console.log(err.message)
        }
    })
})


app.post("/login", (req, res) => {
    const { username, password } = req.body
    mysql.query(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, result) => {
        if (result.length > 0) {
            res.redirect(`/home?username=${encodeURIComponent(username)}`)
        } else {
            res.render('login', { error: 'Invalid username or password' });
        }
    })
})

app.post("/home", upload.array('file', 100), (req, res) => {
    const filePaths = req.files.map(file => file.path);
    mysql.query(`INSERT INTO project (file_paths) VALUES(?)`, [filePaths.join(';')], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send('Files uploaded successfully!');
        }
    })
})

app.get("/home", (req, res) => {
    const username = req.query.username;
    res.status(200).render("home", { title: 'home page', username })
    if (!username) {
        res.redirect('/login')
    }
})

app.get("/login", (req, res) => {
    res.status(200).render("login", { error: null, title:"Login" })
})

app.get("/delete", (req, res) => {
    res.status(200).render("deleteUser", { title: "delete page" })
})

app.post("/deleteuser", (req, res) => {
    const { email } = req.body
    mysql.query("DELETE FROM users WHERE email = ?", [email], (err, result) => {
        if (!err) {
            res.status(200).redirect("/");
        } else {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    })
})
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})