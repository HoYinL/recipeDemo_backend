import PostComment from "../../../models/postcomment.js";
import PostCommentList from "../../../models/postcommentlist.js";
import PublishedPost from "../../../models/publishedpost.js";
import mongoose from "mongoose";

export const commentPost = async (req, res) => {
    const { postId, userId } = req.params;
    const { commentContent } = req.body;

    const newCommentPost = new PostComment({
        comment: commentContent,
        commenter: userId,
        _id: new mongoose.Types.ObjectId(),
    });

    try {
        const comment = await newCommentPost.save();
        const post = await PublishedPost.findById(postId);
        const commentList = await PostCommentList.findById(post.commentList);

        commentList.commentList = [comment.id, ...commentList.commentList];

        const returnList = await commentList.save();

        res.status(200).json({ commentList: returnList });
    } catch (error) {
        res.status(500).send(error)
    }
};

export const getCommentList = async (req, res) => {
    try {
        const { limit, postId } = req.params;

        const post = await PublishedPost.findById(postId);
        const commentList = await PostCommentList.findById(post.commentList);

        const returnCommentList = commentList.commentList.splice(0, limit * 10);

        res.status(200).json({ commentList: returnCommentList });
    } catch (error) {
        res.status(500).send('sth happen')
    }
};

export const getComment = async (req, res) => {
    const { commentId } = req.params;
    try {
        const postComment = await PostComment.findById(commentId);

        await postComment.populate('commenter');

        res.status(200).json({ comment: postComment })
    } catch (error) {
        res.status(500).send(error)
    }
}