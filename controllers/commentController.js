import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';

export const createComment = async (req,res)=>{
    try{
        const doc = new CommentModel({
            text: req.body.text,
            post:req.params.id,
            user:req.userId,

        });

        const comment = await doc.save();
        res.json(comment);
    } catch(err){
        console.log(err);
        res.status(500).json({
            message:'не удалось создать статью'});
    }
};

export const getComment = async (req,res)=>{
    try{
        const post = req.params.id;
        const comment = await CommentModel.find({
            post:post
        }).populate('user').exec();
        res.json(comment);
    } catch(err){
        console.log(err);
        res.status(500).json({
            message:'не удалось получить комментарии'});
    }
};

export const getLastComment =async (req,res)=>{
    try{
        const posts = await PostModel.find().sort({viewsCount:'desc'}).limit(5).exec();
        const postId = posts.map(obj => obj._id).flat().slice(0,5);
        const comment = await CommentModel.find({
            post:postId
        }).populate('user').exec();
        res.json(comment)
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:'Не удалось получить статьи'});
    }
}

