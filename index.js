import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import fs from 'fs';
import cors from 'cors';
import {registerValidation,loginValidation,postCreateValidation} from './validations.js';

import {UserController,PostController} from './controllers/index.js';
import {handleValidationErros,checkAuth} from './utils/index.js';

mongoose.connect(
    process.env.MONGO_HOST ? process.env.MONGO_HOST : 
    'mongodb+srv://admin:eeeeee@cluster0.kjp1xel.mongodb.net/blog?retryWrites=true&w=majority'
).then(()=> console.log('DB OK'))
.catch((err) => console.log('DB Error', err));

const app = express();

const avastorage = multer.diskStorage({
    destination: (_, __, cb)=>{
        if(!fs.existsSync('avatar')){
            fs.mkdirSync('avatar');
        };
        cb(null,'avatar');
    },
    filename:(_,file,cb)=>{
        cb(null,file.originalname);
    },
});

const storage = multer.diskStorage({
    destination: (_, __, cb)=>{
        if(!fs.existsSync('uploads')){
            fs.mkdirSync('uploads');
        };
        cb(null,'uploads');
    },
    filename:(_, file, cb)=>{
        cb(null,file.originalname);
    },
});

const avatar = multer({
    storage: avastorage,
    
});

const upload = multer({
    storage
});

app.use(express.json());
app.use(cors());

app.use('/avatar',express.static('avatar'));
app.use('/uploads',express.static('uploads'));


app.post('/auth/login',loginValidation,handleValidationErros, UserController.login )

app.post('/auth/register',registerValidation,handleValidationErros, UserController.register);

app.get('/auth/me', checkAuth,UserController.getMe);

app.post('/avatar',avatar.single('image'), (req,res)=>{
    res.json({
        url:`/avatar/${req.file.originalname}`,
    })
});

app.post('/upload',checkAuth,upload.single('image'), (req,res)=>{
    res.json({
        url:`/uploads/${req.file.originalname}`,
    })
});

app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts',checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', PostController.update);
app.get('/tags/:tag',PostController.getPostByTag);

app.listen(
    process.env.PORT || 
    4444,(err)=> {
    if(err){
        return console.log(err);
    }
    console.log('Server OK')
})