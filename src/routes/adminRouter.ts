import { Router } from 'express';
import { fileURLToPath } from "url";
import multer from 'multer';
import path from 'path';
import  adminController from "../controllers/adminController.js"
import { adminAuth } from '../middlewares/auth.js';

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


export const adminRouter = Router();

adminRouter.get('/login', adminController.getAdminLogin);
adminRouter.post('/login', adminController.verifyAdmin);
adminRouter.get('/dashboard',adminAuth,adminController.getDashboard)
adminRouter.delete('/delete-user/:userId',adminAuth,adminController.deleteUser )
adminRouter.post('/add-user',adminAuth,upload.single('image'),adminController.addUser)
adminRouter.put('/edit-user/:userId',adminAuth,upload.single('image'),adminController.editUser)
adminRouter.patch('/block-user/:id',adminAuth,adminController.blockUser);
adminRouter.post('/logout',adminAuth,adminController.adminLogout)

