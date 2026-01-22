import type { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel.js";
import { StatusCode } from "../utils/stautsCodes.js";
import bcrypt from "bcrypt";

const securePassword = async (password: string): Promise<string> => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        throw new Error("Password hashing failed");
    }
};



const getLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.session.userId
        if(user){
            res.redirect('/')
            return;
        }
        res.render("login")
    } catch (error) {
        console.error("Error loading Login page:", error);
        res.status(500).send("Internal Server Error");
    }
}
const verifyLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const exisitingUser = await User.findOne({ email })

        
        if (exisitingUser) {
            if (exisitingUser.isAdmin) {
                res.status(StatusCode.BAD_REQUEST).json({ success: false, message: "access denied" });
                return;
            }

            const passwordMatch = await bcrypt.compare(password, exisitingUser.password)

            if (passwordMatch) {


                if (exisitingUser.isBlocked) {
                    res.status(403).json({ success: false, message: "Your account has been blocked by admin" });
                    return;
                }


                req.session.userId = exisitingUser.id;
                res.status(StatusCode.OK).json({ success: true, message: "login successfull", redirectUrl: "/" })
                return;

            }
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message: "incorrect password" })
            return
        }
        res.status(StatusCode.BAD_REQUEST).json({ success: false, message: "user not found" })
        return;

    } catch (error) {
        console.error("Error varifying user", error);
        res.status(500).send("Internal Server Error");
    }

}
const getHome = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId;

   
    if (!userId) {
      res.redirect("/login");
      return ;
    }

    const findUser = await User.findById(userId);

    
    if (!findUser) {
     res.redirect("/login");
      return ;
    }
//   console.log(findUser);
  
    
    res.render("home", {
      user: {
        id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        phone: findUser.phone,
        image: findUser.image,
      }
    });

  } catch (error) {
    console.error("Error loading home page:", error);
    res.status(500).send("Internal Server Error");
  }
};


const getSignUp = async (req: Request, res: Response): Promise<void> => {
    try {
        res.render("signup")
    } catch (error) {
       console.error("Error loading Signup page:", error);
        res.status(500).send("Internal Server Error");
    }

}
const signUp = async (req: Request, res: Response): Promise<void> => {
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
};

const updateProfile = async (req: Request, res: Response): Promise<void> => {

    try {

        // console.log(req.body)
        const { userId, name, email, phone } = req.body;

        const updateData: any = {
            name,
            email,
            phone
        };

        if (req.file) {

            updateData.image = req.file.filename;
        }


        const userData = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );

        if (userData) {
            res.status(StatusCode.OK).json({ success: true, message: "profile updated successfully" });
            return
        } else {
            res.redirect("/")
            return;
        }
    } catch (error) {
        console.log(error);
    }
}

const logout = async (req:Request,res:Response) => {
    try {
        req.session.destroy(err=>{
            if(err){
                res.status(StatusCode.BAD_REQUEST).json({success:false,message:"error destroying the session"})
            }
        })
        res.status(StatusCode.OK).json({success:true,message:"you have successfully logged out"})
    } catch (error) {
        console.log("error signUp", error);
        res.status(500).json({ message: "Server error" });
    }
    
}



export default {
    getLogin,
    verifyLogin,
    getSignUp,
    signUp,
    getHome,
    updateProfile,
    logout,
}