const {postModel} = require('../models/Post');
const {userModel} = require('../models/User');
const {membersModel} = require('../models/Members');
const {messageModel} = require('../models/Messages');

const createPost = async (req,res) => {
    try {
        const post = new postModel({
            title:req.body.title,
            description:req.body.description,
            user:req.userId
        });
        

        await post.save();

        res.json(post);
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            message:"Internal server erorr"
        })
    }
}

const getAllPosts = async (req, res) => {
    try {
        const posts = await postModel.find().populate({
            path: 'user',
            populate: {
                path: 'members',
            }
        }).exec();

        if (posts.length === 0) {
            return res.status(404).json({
                message: "Posts not found!"
            });
        }
        
        res.json(posts);
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            message: "Internal server error"
        });
    }
};
const getPost = async(req,res) => {
    try {
        const post = await postModel.findById(req.params.id);

        if(!post){
            return res.status(404).json({
                message:"Post not found!"
            })
        }

        res.json(post)
    } catch (error) {
        console.log(error);
    }
}


const editPost = async (req,res) => {
    try {
        const post = await postModel.findByIdAndUpdate({_id:req.params.id}, {
            title:req.body.title,
            description:req.body.description
        },{
            new:true
        });


        if(!(req.userId === "65538c47ce53d8e01ed952a7") && (post.user._id.toString() !== req.userId)){
            return res.status(500).json({
                message:"No access!!"
            })
        }


        if(!post){
            return res.status(404).json({
                message:"Post not found!"
            })
        }

        res.json(post);

    } catch (error) {
        console.log(error);
        return res.status(503).json({
            message:"Internal server erorr"
        })
    }
}

const deletePost = async (req,res) => {
    try {
        const post = await postModel.findByIdAndDelete(req.params.id);

        if(!post){
            return res.status(404).json({
                message:"Post not found!"
            })
        }
        if(!(req.userId === "65538c47ce53d8e01ed952a7") && (post.user._id.toString() !== req.userId)){
            return res.status(500).json({
                message:"No access!!"
            })
        }
        res.json({
            message:"Successful delete"
        })
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            message:"Internal server erorr"
        })
    }
}
const addMember = async(req,res) => {
    try {
        const user = await userModel.findOne({email:req.body.email});
        const post = await postModel.findById(req.params.id);

        if(!user){
            return res.status(404).json({
                message:"User not found!!"
            })
        }

        if(post.members === null){
            post.members = [];
        }

        if(!(req.userId === "65538c47ce53d8e01ed952a7") && (post.user._id.toString() !== req.userId)){
            return res.status(500).json({
                message:"No access!!"
            })
        }


        const member = new membersModel({
            user:user._id
        });


        post.members.push(member);
        const postDoc = await post.save();
        const memberDoc = await member.save();

        res.json(memberDoc)



        if(!post){
            return res.status(404).json({
                message:"Post not found!!"
            })
        }
        
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            message:"Internal server erorr"
        })
    }
}

const getAllMembers = async(req,res) => {
    try {
        const post = await postModel.findById(req.params.id).populate({
            path:'members',
            populate:{
                path:'user',
            },
        });

        if(!post){
            return res.status(404).json({
                message:"Post not found!!"
            })
        }

        if(!(req.userId === "65538c47ce53d8e01ed952a7") && (post.user._id.toString() !== req.userId)){
            return res.status(500).json({
                message:"No access!!"
            })
        }

        const members = post.members;

        res.json(members)

    } catch (error) {
        console.log(error);
        return res.status(503).json({
            message:"Internal server erorr"
        })
    }
}

const deleteMember = async(req,res) => {
    try {
        const post = await postModel.findById(req.params.id);

        const member  = await membersModel.findByIdAndDelete(req.params.memberId);

        if(!post){
            return res.status(404).json({
                message:"Post not found!!"
            })
        }

        
        if(!member){
            return res.status(404).json({
                message:"User not found!!"
            })
        }

        if(!(req.userId === "65538c47ce53d8e01ed952a7") && (post.user._id.toString() !== req.userId)){
            return res.status(500).json({
                message:"No access!!"
            })
        }

        post.members.pull(member);

        await post.save();

        res.json({
            success:true,
            message:"Successful deleted member"
        })
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            message:"Internal server erorr"
        })
    }
}

const setAdmin = async (req, res) => {
    try {
        const member = await membersModel.findByIdAndUpdate(req.params.memberId, {
            $set: { isAdmin: true }
        }, {
            new: true
        });

        if (!member) {
            return res.status(404).json({
                message: "User not found!"
            });
        }

        const post = await postModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found!!"
            });
        }

        const user = await userModel.findByIdAndUpdate({_id:req.params.userid},{
            $set: { isAdmin: true }
        },{
            new:true
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found!!"
            });
        }

        if (!(req.userId === "65538c47ce53d8e01ed952a7") && (post.user._id.toString() !== req.userId)) {
            return res.status(500).json({
                message: "No access!!"
            });
        }

        await post.save();
        await user.save();
        res.json(member);

    } catch (error) {
        console.log(error);
        return res.status(503).json({
            message: "Internal server error"
        });
    }
};

const unsetAdmin = async(req,res)=> {
    try {
        const member = await membersModel.findByIdAndUpdate(req.params.memberId, {
            $set: { isAdmin: false }
        }, {
            new: true
        });

        if (!member) {
            return res.status(404).json({
                message: "User not found!"
            });
        }

        const post = await postModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found!!"
            });
        }

        const user = await userModel.findByIdAndUpdate({_id:req.params.userid},{
            $set: { isAdmin: false }
        },{
            new:true
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found!!"
            });
        }

        if (!(req.userId === "65538c47ce53d8e01ed952a7") && (post.user._id.toString() !== req.userId)) {
            return res.status(500).json({
                message: "No access!!"
            });
        }

        await post.save();
        await user.save();
        res.json(member);

    } catch (error) {
        console.log(error);
        return res.status(503).json({
            message: "Internal server error"
        });
    }
}

const SendMessage = async(req,res) => {
    try {   
        const newMessage = new messageModel({
            text:req.body.text,
            user:req.userId
        });

        const post = await postModel.findById(req.params.id)

        if(!post){
            return res.status(404).json({
                message: "Post not found!!"
            });
        }
        
        post.messages.push(newMessage);

        await newMessage.save();

        await post.save();

        res.json(post);

    } catch (error) {
        console.log(error);
        return res.status(503).json({
            message: "Internal server error"
        });
    }
}

const getAllMessages = async(req,res) => {
    try {
        const message = await postModel.findById(req.params.id).populate({
            path:'messages',
            populate:{
                path:'user'
            }
        }).exec();

        if(!message){
            return res.status(404).json({
                message: "Post not found!!"
            });
        }

        res.json(message)
    } catch (error) {
        console.log(error);
                return res.status(503).json({
            message: "Internal server error"
        });
    }
}


module.exports = {
    createPost,
    editPost,
    deletePost,
    getAllPosts,
    addMember,
    getAllMembers,
    deleteMember,
    deleteMember,
    setAdmin,
    unsetAdmin,
    SendMessage,
    getAllMessages,
    getPost
}