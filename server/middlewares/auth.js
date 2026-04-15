const jwt = require("jsonwebtoken")
const User = require("../models/User")


exports.auth = async (req,res, next) => {

    try {
        console.log("AUTH HEADER FULL:", req.get("Authorization"));
        console.log("TOKEN AFTER EXTRACT:", req.body.token || req.cookies.token || req.get("Authorization")?.replace("Bearer ", ""));
        const token = req.body.token || req.cookies.token || req.get("Authorization")?.replace("Bearer ", "");
        
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'TOken is missing',
            });
        }
        try {
            const payload = jwt.verify(token,process.env.JWT_SECRET);
            req.user = payload;
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Invaild token."
            })
        } 
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success:false,
            message:"Error in validating token"
        })
    }
}

exports.isStudent = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Students only',
            });
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })
    }
}
exports.isInstructor = async(req,res,next) => {
    try{
        const userDetails = await User.findById(req.user.id);
        if(userDetails.accountType !== "Instructor") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Instructor only',
            });
        }
        if(!userDetails.approved) {
            return res.status(403).json({
                success:false,
                message:'Your instructor account is not approved yet. Please wait for admin approval.',
            });
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })
    }
}

exports.isAdmin = async (req, res, next) => {
    try{
           if(req.user.accountType !== "Admin") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Admin only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }
