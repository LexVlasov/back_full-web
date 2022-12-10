import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async(req,res) => {
    try {
       

    const password = req.body.password;
    const salt = await  bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
;
    const doc = new UserModel({
        email:req.body.email,
        fullName:req.body.fullName,
        avatarUrl:req.body.avatarUrl,
        passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign({
        _id:user._id,
    }, 'secret123',
    {
        expiresIn:'30d'
    });
    console.log(user._doc);
    const { passwordHash, ...userData }= user._doc;
    res.json({...userData
        ,token});
    } catch (err) {
        console.log(err.response);
      console.log(err.request);
      console.log(err.message);
        res.status(500).json({
            message:'не удалось зарегстрироваться'});
    }};

    export const login = async (req,res)=>{
        try{
            const user = await UserModel.findOne({email:req.body.email});
    
            if(!user){
                return res.status(404).json({message:'Nothing in database. User not found.'})
            }
            const isvalidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
            if(!isvalidPass){
                return res.status(404).json({
                    message: 'Wrong password or login'
                });
            }
            const token = jwt.sign({
                _id:user._id,
            }, 'secret123',
            {
                expiresIn:'30d'
            })
            const { passwordHash, ...userData }= user._doc;
            res.json({
                ...userData
                ,token,
            });
        } catch(err){
            console.log(err);
            res.status(500).json({
                message:'не удалось авторизоваться'});
        }
    };

    export const getMe = async (req,res)=>{
        try{
            const user = await UserModel.findById(req.userId);
            if(!user){
                return res.status(404).json({
                    message: 'User not found',
                });
            }
            const { passwordHash, ...userData }= user._doc;
            res.json(userData);
        }catch(err){
            console.log(err);
            res.status(500).json({
                message:'Nothing access'});
        }
        
    };

    export const getAccount = async (req,res)=>{
        try{
            const user = await UserModel.findById(req.params.id);
            if(!user){
                return res.status(404).json({
                    message: 'User not found',
                });
            }
            const { passwordHash, ...userData }= user._doc;
            res.json(userData);
        }catch(err){
            console.log(err);
            res.status(500).json({
                message:'Nothing access'});
        }
        
    };