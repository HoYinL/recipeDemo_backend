import BlockedPostList from '../../../models/blockedpostlist.js';
import User from '../../../models/users.js';

export const blockPost = async (req, res) => {
    const { userId, postId } = req.params;

    try {
        const user = await User.findById(userId);
        const blockedPostList = await BlockedPostList.findById(user.blockedPostList);

        blockedPostList.blockedPostList = [...blockedPostList.blockedPostList, postId];

        await blockedPostList.save();

        res.status(200).json({ success: 'blocked Post' });
    } catch (error) {
        res.status(500).send(error)
    }
};

export const getBlockedPostList = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        const blockedPostList = await BlockedPostList.findById(user.blockedPostList);

        res.status(200).json({ blockedPosts: blockedPostList.blockedPostList });
    } catch (error) {
        res.status(500).send(error);
    }
};