import User from '../../../models/users.js';
import PublishedPost from '../../../models/publishedpost.js';
import MarkedPostList from '../../../models/markedpostlist.js';

export const markPost = async (req, res) => {
    const { userId, postId } = req.params;

    try {
        const user = await User.findById(userId);
        const post = await PublishedPost.findById(postId);

        const markedPostList = await MarkedPostList.findById(user.markedPostList);

        markedPostList.markedPostList = [post._id, ...markedPostList.markedPostList];

        await markedPostList.save();

        post.bookmarked = post.bookmarked == undefined? 1: ++post.bookmarked;

        await post.save();
    } catch (error) {
        res.status(500).send(error);
    }
};

export const unmarkPost = async (req, res) => {
    const { userId, postId } = req.params;

    try {
        const post = await PublishedPost.findById(postId);

        post.bookmarked -= 1;

        await post.save();
        const user = await User.findById(userId);

        const markedPostList = await MarkedPostList.findById(user.markedPostList);
        
        const filteredList = markedPostList.markedPostList.filter(id => id != postId);
        markedPostList.markedPostList = filteredList;

        await markedPostList.save();

        res.status(200).json({ success: 'post is unmarked' })
    } catch (error) {
        res.status(500).send(error);
    };
};

export const getMarkedPostList = async (req, res) => {
    const { userId, limit } = req.params;
    const limitLength = parseInt(limit);

    try {
        const user = await User.findById(userId);
        
        const markedPostList = await MarkedPostList.findById(user.markedPostList);
        //const markedPostList = await PostList.populate('markedPostList');

        const clonePostList = [...markedPostList.markedPostList];
        const returnPostList = clonePostList.splice(0, limitLength * 10);

        res.status(200).json({ postList: returnPostList });
    } catch (error) {
        res.status(500).send(error);
    };
};

export const getWholeMarkedPostList = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        const markedPostList = await MarkedPostList.findById(user.markedPostList);
        
        res.status(200).json({ postList: markedPostList.markedPostList });
    } catch (error) {
        res.status(500).send(error);
    };
}

