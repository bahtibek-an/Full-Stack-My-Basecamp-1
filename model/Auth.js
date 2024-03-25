const userModel = require("./userModel");

const checkAdmin = (req, res, next) => {
    const { username } = req.body;
    userModel.query('SELECT is_admin FROM users WHERE username = ?', [username], (err, result) => {
        if (err) {
            console.error('Error checking admin status:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (result && result.length > 0 && result[0].is_admin) {
            next(); 
        } else {
            res.redirect("/home"); 
        }
    });
};


module.exports = {
    checkAdmin
}