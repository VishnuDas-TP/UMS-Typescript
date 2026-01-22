import type { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel.js";
import { StatusCode } from "../utils/stautsCodes.js";
import bcrypt from "bcrypt";
import { STATUS_CODES } from "http";
import { log } from "console";


const securePassword = async (password: string): Promise<string> => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        throw new Error("Password hashing failed");
    }
};

const getAdminLogin = async (req:Request,res:Response): Promise<void> => {
    try {
        res.render("adminLogin")
    } catch (error) {
       console.error("Error loading Admin login page", error);
        res.status(500).send("Internal Server Error");
    }
    
}

const verifyAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        // console.log(email);


        const admin = await User.findOne({ email, isAdmin: true });

        if (admin) {
            const passwordMatch = await bcrypt.compare(password, admin.password);

            if (passwordMatch) {
                req.session.userId = admin.id.toString();;
                req.session.isAdmin = true;

                req.session.save((err) => {
                    if (err) {
                        console.error("Session save failed:", err);
                        return res.status(500).json({ message: "Session error" });
                    }

                    console.log("Saved session userId:", req.session.userId);

                    res.status(StatusCode.OK).json({ success: true, redirectUrl: '/admin/dashboard' });
                    return;
                });
            }    
            else {
                res.status(StatusCode.BAD_REQUEST).json({ success: false, message: 'invalid credentials' });
                return;
            }
        } else {
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message: 'admin not found' });
            return;
        }

    } catch (error) {
        console.error("Error varifying admin", error);
        res.status(500).send("Internal Server Error");
    }
}

const getDashboard = async (req:Request,res:Response): Promise<void> => {
    try {
        const adminId = req.session.userId;
        console.log("admin:",adminId);
        
        
        const user = await User.find({isAdmin:false});
        if(!adminId){
            res.status(StatusCode.BAD_REQUEST).json({success:false,message:'admin not found'});
            return;
        }
       res.render('dashboard',{
        user:user
       });
    } catch (error) {
       console.error("Error getting  Dashboard", error);
        res.status(500).send("Internal Server Error");
    }
}

const deleteUser = async(req:Request,res:Response) : Promise<void> =>{

    try {
        const userId = req.params.userId

        const user = await User.findByIdAndDelete(userId)

        if(user){
            res.status(StatusCode.OK).json({success:true,message:"user deleted successfully"});
            return
        }else{
            res.status(StatusCode.BAD_REQUEST).json({success:false,message:"user not found"});
            return
        }
    } catch (error) {
        console.log(error);
        
    }
}
const addUser= async (req:Request,res:Response): Promise<void> => {
    try {
            const { name, email, phone, password } = req.body;
    
            if (!name || !email || !phone || !password) {
                res.status(400).json({ message: "All fields are required" });
                return ;
            }
    
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                 res.status(409).json({ message: "User already exists" });
                 return;
            }
    
            const securePass = await securePassword(password);
    
            const user = new User({
                name,
                email,
                phone,
                password: securePass,
                image: req.file?.filename,
            });
            await user.save();
            res.status(201).json({
                success: true,
                message: "Signup successful"
            });


        } catch (error) {
            console.log("error signUp", error);
            res.status(500).json({ message: "Server error" });
        }
}

const editUser = async (req:Request,res:Response) => {
    try {
        const {userId} =  req.params;
        const {name,email,phone} = req.body;
        
        

        if(!userId){
            res.status(StatusCode.BAD_REQUEST).json({success:false,message:"User id not found"});
        }
        const updateData : any= {
            name,
            email,
            phone,
        } 

        if(req.file){
            updateData.image = req.file.filename;
        }

        const updatedUser = await  User.findByIdAndUpdate(
            userId,
            updateData,
            {new:true}
        );

        if (!updatedUser) {
        return res.status(404).json({success: false,message: "User not found", });
        }

        return res.status(200).json({success: true,message: "User updated successfully"});
    
    } catch (error) {
        console.error("Edit user error:", error);
        return res.status(500).json({success: false,message: "Internal server error",});
    }
    
}

const blockUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false,message: "User not found" });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.status(200).json({
            success: true,
            message: user.isBlocked
                ? "User blocked successfully"
                : "User unblocked successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false,message: "Server error" });
    }
};

const adminLogout =async (req:Request,res:Response): Promise<void> => {
    try {
        const admindata = req.session.userId
        // console.log(req.session.userId);

            if(admindata){
                
                req.session.destroy((err)=>{
                    if(err){
                        console.error("Admin logout failed",err);
                        res.status(StatusCode.SERVER_ERROR).json({success:false,message:'Logout failed'});
                        
                    }
                    res.status(StatusCode.OK).json({success:true,message:'Successfully Logged out',redirectUrl:'/admin/login'})
                })
            }
    } catch (error) {
        console.error("Admin logout error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
    
}

export default{
    getAdminLogin,
    verifyAdmin,
    getDashboard,
    deleteUser,
    addUser,
    editUser,
    blockUser,
    adminLogout
}