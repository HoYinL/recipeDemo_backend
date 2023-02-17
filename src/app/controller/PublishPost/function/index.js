import User from '../../../models/users.js';
import PublishedFeatures from '../../../models/publishedfeatures.js';
import PublishedPost from '../../../models/publishedpost.js';
import PublishedPostList from '../../../models/publishedpostlist.js';
import PostCommentList from '../../../models/postcommentlist.js';
import PostList from '../../../models/postlist.js';
import Content from '../../../models/content.js';
import mongoose from 'mongoose';

export const uploadPostContent = async (req, res) => {
    const { content } = req.body;
  
    const newContent = new Content({
      _id: new mongoose.Types.ObjectId(),
      content,
    })
  
    try {
      const content = await newContent.save();
  
      res.status(200).json({ content: content._id })
    } catch (error) {
      res.status(500).send(error);
    }
  };

export const publishPost = async (req, res) => {
    const { userId } = req.params;
    const { blogContent } = req.body;
    const { dishName, description, backgroundImg, tagList } = req.body.featureData;
  
    const newPublishedFeatures = new PublishedFeatures({
      dish_name: dishName,
      description,
      backgroundImg,
      tagList,
      _id: new mongoose.Types.ObjectId(),
    });
  
    const newPublishedPost = new PublishedPost({
      content: blogContent,
      author: userId,
      comment: new mongoose.Types.ObjectId(),
      feature: new mongoose.Types.ObjectId(),
      _id: new mongoose.Types.ObjectId(),
      createAt: Date.now(),
      bookmarked: 0,
      postListId: new mongoose.Types.ObjectId(),
    });
  
    const newCommentList = new PostCommentList({
      commentList: [],
      _id: new mongoose.Types.ObjectId(),
    });
  
    const newPostList = new PostList({
      post: new mongoose.Types.ObjectId(),
      _id: new mongoose.Types.ObjectId(),
    });
  
    try {
      const commentList = await newCommentList.save();
      const feature = await newPublishedFeatures.save();
  
      newPublishedPost.feature = feature._id;
      newPublishedPost.commentList = commentList._id;
  
      const blog = await newPublishedPost.save();
      const user = await User.findById(userId);
      const publishedPostList = await PublishedPostList.findById(user.publishedPostList);
  
      publishedPostList.postList = [blog._id, ...publishedPostList.postList];
      await publishedPostList.save();
  
      newPostList.post = blog._id;
      newPostList._id = blog.postListId;
  
      await newPostList.save();
  
      res.status(200).json({ success: 'blog is successfully published' });
    } catch (error) {
      res.status(500).send(error);
    };
  };

export const getPublishedPostList = async (req, res) => {
    const { userId, limit } = req.params;

    const limitLength = parseInt(limit);
  
    try {
      const user = await User.findById(userId);
      const publishedPostList = await PublishedPostList.findById(user.publishedPostList);
  
      const returnPosts = publishedPostList.postList.slice(0, limitLength * 10);
  
      res.status(200).json({ posts: returnPosts });
    } catch (error) {
      res.status(500).send(error);
    }
  };

  export const getPublishedPostFeatures = async (req, res) => {
    const { postId } = req.params;
  
    try {
      const publishedPost = await PublishedPost.findById(postId);
      const feature = await publishedPost.populate('feature');
  
      res.status(200).json({ feature });
    } catch (error) {
      res.status(500).send(error);
    }
  };

  export const getPublishedPostAuthor = async (req, res) => {
    const { postId } = req.params;
  
    try {
      const publishedPost = await PublishedPost.findById(postId);
      
      const user = await publishedPost.populate('author');
  
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).send(error);
    }
  };


  export const getPublishedPostContent = async (req, res) => {
    const { postId } = req.params;
  
    try {
      const postList = await PostList.findById(postId);
      const post = await postList.populate('post');
  
      res.status(200).json({ post });
    } catch (error) {
      res.status(500).send(error);
    }
  };

  export const deletePublishedPost = async (req, res) => {
    // delete 1. post 2. feature data 3. post list 
    const { postId, userId } = req.params;
  
    try {
      const post = await PublishedPost.findByIdAndDelete(postId);
      const user = await User.findById(userId);
      const publishedPostList = await PublishedPostList.findById(user.publishedPostList);
  
      const filteredList = publishedPostList.postList.filter(id => id != postId);
      publishedPostList.postList = filteredList;
  
      await PublishedFeatures.findByIdAndDelete(post.feature);
      await PostList.findByIdAndDelete(post.postListId);
      await publishedPostList.save();
  
      res.status(200).json({ success: 'published post is deleted successfully!' })
    } catch (error) {
      res.status(500).send(error);
    }
  };

  export const getPosts = async (req, res) => {
    const limit = parseInt(req.params.limit);
  
    try {
      PublishedPost.find({})
      .sort({_id: -1})
      .limit(limit * 10)
      .exec((err, posts) => {
        if (err) throw new Error(`processing error in request`);
        else {  
          const returnPost = posts.map((post) => post._id);

          res.status(200).json({ post: returnPost });
        }
      })
    } catch (error) {
      res.status(500).send(error)
    }
  }