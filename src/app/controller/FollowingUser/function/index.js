import User from '../../../models/users.js';
import FollowingUserList from '../../../models/followinguserlist.js';

export const getFollowingUserList = async (req, res) => {
    const { userId, limit } = req.params;
    const limitLength = parseInt(limit);

    try {
        const user = await User.findById(userId);
        const followingUserList = await FollowingUserList.findById(user.followingUserList);

        const clone_followingUserList = [...followingUserList.followingUserList];

        const return_followingUserList = clone_followingUserList.splice(0, limitLength * 10);

        res.status(200).json({ followingUserList: return_followingUserList });
    } catch (error) {
        res.status(500).send(error)
    };
};

export const extendFollowingUserList = async (req, res) => {
    const { userId, followUserId } = req.params;

    try {
        const user = await User.findById(userId);
        const followingUserList = await FollowingUserList.findById(user.followingUserList);

        followingUserList.followingUserList = [...followingUserList.followingUserList, followUserId];

        await followingUserList.save();

        res.status(200).json({ success: 'Follow user successfully' });
    } catch (error) {
        res.status(500).send(error)
    }
};

export const getWholeFollowingUserList = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        const followingUserList = await FollowingUserList.findById(user.followingUserList);
        
        res.status(200).json(followingUserList);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const reduceFollowingUserList = async (req, res) => {
    const { userId, followUserId } = req.params;

    try {
        const user = await User.findById(userId);
        const followingUserList = await FollowingUserList.findById(user.followingUserList);

        const newFollowingUserList = followingUserList.followingUserList.filter(id => id != followUserId);
        followingUserList.followingUserList = newFollowingUserList;

        await followingUserList.save();
        
        res.status(200).json({ success: 'Follower unfollowed' });
    } catch (error) {
        res.status(500).send(error);
    }
}