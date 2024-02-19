const express = require("express");
const app = express();
const Mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path")
const multer = require('multer');
require("dotenv").config()
const { log } = require("console");
const port = 3300;

const mysql = Mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
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
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});
const upload = multer({ storage: storage });

const checkAdmin = (req, res, next) => {
    const { email } = req.body;
    mysql.query('SELECT is_admin FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.error('Error checking admin status:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (result.length > 0 && result[0].is_admin) {
            next(); 
        } else {
            res.redirect("/home"); 
        }
    });
};




app.get("/", (req, res) => {
    res.status(200).render("index", { title: "form page" })
})

app.get("/signup", (req, res) => {
    res.status(200).render("signup", { title: "Sign up" })
})

app.get("/home", (req, res) => {
    const fs = require('fs');
    const username = req.query.username;
    fs.readdir('uploads/', (err, files) => {
        if (err) {
            console.error('Error reading uploads directory:', err);
        }
        res.status(200).render("home", { title: 'home page', username, success: req.query.success, files })
    });
})

app.get("/login", (req, res) => {
    res.status(200).render("login", { error: null, title:"log in", fail:req.query.fail })
})

app.get("/delete", (req, res) => {
    res.status(200).render("deleteUser", { title: "delete page" })
})

app.get("/admin", (req, res)=>{
    const username = req.query.username;
    // const userId = req.params.userId;

    mysql.query('SELECT * FROM users', (err, rows) => {        
        res.status(200).render("AdminPage", {title:"admin Page", users:rows, username, isDelete:req.query.delete})      
    });
})

app.get('/users/:userId/edit', (req, res) => {
    const userId = req.params.userId;

    mysql.query('SELECT * FROM users WHERE id = ?', [userId], (err, rows) => {        
        const user = rows[0]; // Assuming the user is found
        res.render('editUser', { user, title:"user edit" });
    });
});




app.post('/upload', upload.single('file'), function (req, res, next) {
    res.redirect('/home?success=true');
});


app.post("/signup",  (req, res) => {
    const { username, email, password } = req.body
    mysql.query(`INSERT INTO users (username, email , password) VALUES (?, ? , ?)`, [username, email, password], (err, result) => {
        if (!err) {
            res.status(200).redirect(`/home?username=${encodeURIComponent(username)}`)
        } else {
            console.log(err.message)
        }
    })
})

app.post("/login", checkAdmin, (req, res) => {
    const { email, password } = req.body;
    mysql.query(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, result) => {
        if (result.length > 0) {
            const username = result[0].username;
            if (result[0].is_admin) {
                res.redirect(`/admin?username=${encodeURIComponent(result[0].username)}`);
            } else {
                res.redirect(`/home?username=${encodeURIComponent(result[0].username)}`);
            }
        } else {
            res.redirect("/login?fail=true");
        }
        console.log(result[0])

    });
});

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

app.post('/users/:userId/edit', (req, res) => {
    const userId = req.params.userId;
    const { is_admin } = req.body; 
    mysql.query('UPDATE users SET is_admin = ? WHERE id = ?', [is_admin, userId], (err, result) => {
        if (err) {
            console.error('Error updating user data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.redirect('/admin'); // Redirect to the user's profile page after updating
    });
});



app.post('/users/:userId/delete', (req, res) => {
    const userId = req.params.userId;

    mysql.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
        res.redirect('/admin?delete=true');
    });
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})