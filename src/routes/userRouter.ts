import { Router } from 'express';
import { fileURLToPath } from "url";
import multer from 'multer';
import path from 'path';
import userController from '../controllers/userController.js';
import { userAuth } from '../middlewares/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'))
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  }
});
const upload = multer({storage:storage})




export const userRouter = Router();

userRouter.get('/login',userController.getLogin);
userRouter.post('/login',userController.verifyLogin);
userRouter.get('/',userAuth,userController.getHome);
userRouter.get('/signup',userController.getSignUp);
userRouter.post('/signup',upload.single('image'),userController.signUp);
userRouter.post('/logout',userAuth,userController.logout);
userRouter.post('/update-profile',userAuth,upload.single('image'),userController.updateProfile);