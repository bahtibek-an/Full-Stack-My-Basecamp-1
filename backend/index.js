const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { signIn, signUp } = require('./Controllers/authController');
const { deleteUser, editUser,authMe } = require('./Controllers/userController');
const { auth } = require('./chekAuth.js');
const { createPost, getAllPosts,editPost,deletePost , addMember, getAllMembers,deleteMember,setAdmin,unsetAdmin,SendMessage,getAllMessages,getPost} = require('./Controllers/PostController');
const cors = require('cors')
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send({
        message: "Hello"
    });
});

app.use(cors());
app.use(express.json());

app.post('/post/create', auth, createPost);
app.post('/auth/register', signUp);
app.get('/post/getOne/:id',auth,getPost);
app.post('/auth/login', signIn);
app.post('/user/delete', auth, deleteUser);
app.get('/auth/me',auth,authMe)
app.get('/posts', auth, getAllPosts);
app.patch('/post/edit/:id',auth,editPost);
app.post('/post/delete/:id',auth,deletePost);
app.patch('/user/edit', auth, editUser);
app.post('/post/addMember/:id',auth,addMember);
app.get('/post/members/:id',auth,getAllMembers)
app.post('/post/deleteMember/:id/:memberId',auth,deleteMember);
app.post('/post/setAdmin/:id/:memberId/:userid',auth,setAdmin);
app.post('/post/unSetAdmin/:id/:memberId/:userid',auth,unsetAdmin);
app.post('/post/SendMessage/:id',auth,SendMessage);
app.get('/post/GetALLMessages/:id',auth,getAllMessages);



app.listen(PORT, () => {
    mongoose.connect("mongodb+srv://akbaralievbehruz44:user@cluster0.6tpnz02.mongodb.net/basecamp?retryWrites=true&w=majority")
        .then(() => {
            console.log("DB ok");
        }).catch((e) => {
            console.log(e);
        });
    console.log("http://localhost:5000");
});
