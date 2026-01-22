import type { Request,Response,NextFunction} from "express"
import { User } from "../models/userModel.js";

 export const userAuth = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.redirect('/login');
    }

    const user = await User.findById(userId);

    if (!user || user.isAdmin || user.isBlocked) {
      req.session.destroy(() => {});
      return res.redirect('/login');
    }

    next();
    
  } catch (error) {
    console.log("Error in userAuth middleware:", error);
    res.redirect('/login');
  }
};

export const adminAuth = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const adminId = req.session.userId;

    if (!adminId) {
      return res.redirect('/admin/login');
    }

    const admin = await User.findById(adminId);

    if (!admin || !admin.isAdmin ) {
      req.session.destroy(() => {});
      return res.redirect('/admin/login');
    }

    next();

  } catch (error) {
    console.log("Error in adminAuth middleware:", error);
    res.redirect('/admin/login');
  }
};
