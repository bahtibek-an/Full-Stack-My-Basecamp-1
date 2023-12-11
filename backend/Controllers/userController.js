const {userModel} = require('../models/User');

const deleteUser = async(req,res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.userId);
        if(!user){
            return res.status(404).json({
                message:"404 User not found"
            })
        }
        res.json({
            success:true,
            message:"Successful deleted account!"
        })
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            message:"Internal server erorr"
        })
    }
}

const editUser = async(req,res) => {
    try {
        const user = await userModel.findByIdAndUpdate({_id:req.userId},{
            name:req.body.name,
            email:req.body.email,
        },{
            new:true
        });

        const name =  await userModel.findOne({name:req.body.name});
        const email = await userModel.findOne({email:req.body.email});

        if(email){
            return res.status(403).json({
                message:"Email arleady used!"
            })
        }
        if(name){
            return res.status(403).json({
                message:"Name arleady used!"
            })
        }

        if(req.body.name.length === 0){
            return res.status(403).json({
                message:"Please enter name!"
            })
        }
        if(req.body.email.length === 0){
            return res.status(403).json({
                message:"Please enter email!"
            })
        }

        await user.save();
        
        res.json(user)

        
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            message:"Internal server erorr"
        })
    }
}

const removeAdmin = (req,res) => {
    try {
        
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            message:"Internal server erorr"
        })
    }
}
const authMe = async(req,res) => {
    try {
        const user = await userModel.findById(req.userId).populate({
            path:'posts',
            populate:{
                path:'user'
            }
        }).exec();

        if(!user){
            return res.status(404).json({
                message:"404 User not found"
            })
        }

        const {passwordHash,...userData} = user._doc

        res.json(userData);
    } catch (error) {
        console.log(error);
        return res.status(503).json({
            message:"Internal server erorr"
        })
    }
}
module.exports = {
    deleteUser,
    editUser,
    authMe
}