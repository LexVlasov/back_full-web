import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';

import cors from 'cors';
import {registerValidation,loginValidation,postCreateValidation} from './validations.js';

import {UserController,PostController} from './controllers/index.js';
import {handleValidationErros,checkAuth} from './utils/index.js';

mongoose.connect(
    process.env.MONGO_HOST
).then(()=> console.log('DB OK'))
.catch((err) => console.log('DB Error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb)=>{
        cb(null,'uploads');
    },
    filename:(_, file, cb)=>{
        cb(null,file.originalname);
    },
});

const upload = multer({
    storage
});

app.use(express.json());
app.use(cors());
app.use('/uploads',express.static('uploads'));

app.post('/auth/login',loginValidation,handleValidationErros, UserController.login )

app.post('/auth/register',registerValidation,handleValidationErros, UserController.register
);

app.get('/auth/me', checkAuth,UserController.getMe);

app.post('/upload',checkAuth,upload.single('image'), (req,res)=>{
    res.json({
        url:`/uploads/${req.file.originalname}`,
    })
});
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts',checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', PostController.update);


app.listen(process.env.PORT || 4444,(err)=> {
    if(err){
        return console.log(err);
    }
    console.log('Server OK')
})