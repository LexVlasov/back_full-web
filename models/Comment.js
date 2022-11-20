import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    text:{
        type:String,
        required: true,
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        require: true,
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
}, 
{
    timestamps:true,
},
);

export default mongoose.model('Comment',CommentSchema);