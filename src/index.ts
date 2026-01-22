import  express  from "express";
import dotenv from "dotenv";
import  Path  from "path";
import session from "express-session";
import nocache from "nocache";

import {userRouter} from './routes/userRouter.js'
import {adminRouter} from './routes/adminRouter.js'
import connectDB from "./config/db.js";

dotenv.config();
await connectDB()

const app = express();
const PORT = process.env.PORT || 3001

app.use(nocache());



app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,              
    saveUninitialized: false,   
    cookie: {
      httpOnly: true,
      secure: false,           
      maxAge: 24 * 60 * 60 * 1000 
    }
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended:true }));


import { fileURLToPath } from 'url';

app.set('view engine','ejs');
const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
app.set('views',[
    Path.join(__dirname,'../src/views/user'),
    Path.join(__dirname,'../src/views/admin')
]);

app.use('/uploads',express.static(Path.join(__dirname, 'public/uploads'), {
    setHeaders: (res, filePath) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
    }
  })
);

app.use('/',userRouter)
app.use('/admin',adminRouter)

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
});
