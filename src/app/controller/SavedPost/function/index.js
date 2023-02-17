import User from '../../../models/users.js';
import AutoSaveData from '../../../models/autosavedata.js';
import AutoSaveBlog from '../../../models/autosaveblog.js';
import SavedPost from '../../../models/savedposts.js';

export const getSavedPostFeatures = async (req, res) => {
    const { postId } = req.params;

    try {
        const savedBlog = await AutoSaveBlog.findById(postId);
        const feature = await savedBlog.populate('feature');

        res.status(200).json({ feature });
    } catch (error) {
        res.status(500).send(error)
    }
};

export const deleteSavedPost = async (req, res) => {
    // delete 1. post 2. feature data 3. post list 
    const { postId, userId } = req.params;

    try {
        const user = await User.findById(userId);
        
        const savedPost = await SavedPost.findById( user.savedPostList);
        const post = await AutoSaveBlog.findByIdAndDelete(postId);

        const filteredList = savedPost.postList.filter(id => id != postId);
        savedPost.postList = filteredList;

        await savedPost.save();
        await AutoSaveData.findByIdAndDelete(post.feature);

        res.status(200).json({ success: 'saved post is deleted successfully!' });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getSavedPostList = async (req, res) => {
    const { userId, limit } = req.params;
    const limitLength = parseInt(limit);

    try {
        const user = await User.findById(userId);

        const savedPost = await SavedPost.findById(user.savedPostList);

        const clonePosts = [...savedPost.postList];
        const returnPostList = clonePosts.splice(0, limitLength * 10);
        savedPost.firstCreate = undefined;

        await savedPost.save();

        res.status(200).json({ posts: returnPostList });
    } catch (error) {
        res.status(500).send(error);
    };
}