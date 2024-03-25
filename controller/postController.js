const userModel = require("../model/userModel");
const bcrypt = require('bcrypt');


const signup = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    userModel.query(`SELECT * FROM users WHERE username = ? AND email = ?`, [username , email], (error, result) => {
      if (result.username === req.body.username  && result.email === req.body.email) {
          console.log(result);
          res.redirect('/signup?error=true');
      } else {
        userModel.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, result) => {
            if (err) {
                res.status(500).send('Error registering user');
                return;
            }
            res.cookie('username', `${username}`, { maxAge: 900000, httpOnly: true });
            console.log('User registered successfully');
            res.status(200).redirect(`/home?username=${username}`);
        });
      }
    });
}


const login = async (req, res) => {
    const { username, password } = req.body;
    userModel.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            res.cookie('username', `${username}`, { maxAge: 900000, httpOnly: true });
            req.session.user = user;
            if (user.is_admin === 1) {
              res.redirect(`/admin?username=${username}`);
          } else {
              res.redirect(`/home?username=${username}`);
          }
        } else {   
            res.status(401).send('Invalid username or password');
        }
    });
}


const deleteuser = (req, res) => {
    const { username } = req.cookies; // Assuming username is stored in a cookie
    if (!username) {
        return res.status(400).send('Username not found in cookies');
    }
    userModel.query(`DELETE FROM comments WHERE user = ?`, [username], (err, commentResult) => {
        if (err) {
            console.error('Error deleting comments:', err);
            return res.status(500).send('Error deleting comments');
        }
        userModel.query("DELETE FROM users WHERE username = ?", [username], (err, result) => {
            if (err) {
                console.error('Error deleting user:', err);
                return res.status(500).send('Error deleting user');
            }           
            if (result.affectedRows > 0) {  
                res.clearCookie("username");    
                res.clearCookie("connect.sid");             
                res.status(200).redirect("/"); 
            } else {
                res.status(404).send('User not found');
            }
        });
    });
};


const userEditPost = (req, res) => {
    const userId = req.params.userId;
    const { is_admin } = req.body; 
    userModel.query('UPDATE users SET is_admin = ? WHERE id = ?', [is_admin, userId], (err, result) => {
        if (err) {
            console.error('Error updating user data:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.redirect('/admin');
    });
}

const userDeletePost = (req, res) => {
    const userId = req.params.userId;

    userModel.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
        res.redirect('/admin?delete=true');
    });
}



const addProject = (req, res) => {
    const {name , description} = req.body
    userModel.query(`INSERT INTO projects (name , description, user) VALUES (?, ?, ?)`, [name , description , `${req.cookies.username}`], (err, result) => {
        if(!err){
            console.log(result);
            res.redirect("/home")
        }else{
            console.log(err);
        }
    })
}

const addComments = (req, res) => {
    const {username} =  req.cookies
    userModel.query(`INSERT INTO comments ( user , comment , projectId ) VALUES ('${username}', '${req.body.comment}', '${req.params.id}')`, (err , result) => {
       if(!err){
           res.redirect(`/comments/${req.params.id}`);
       }
       console.log(err);
    })
}

const updateProject = (req, res) => {
    const { name, description , id} = req.body;

    userModel.query("UPDATE projects SET name = ?, description = ? WHERE id = ?", [name, description, id], (err, result) => {
        if (err) {
            console.error("Error updating project:", err);
            return res.status(500).send("Error updating project");
        }
        res.redirect("/home")
    });
};


module.exports = {
    signup,
    login,
    deleteuser,
    userEditPost,
    userDeletePost,
    addProject,
    addComments,
    updateProject
}