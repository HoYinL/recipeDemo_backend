import User from '../../../models/users.js';
import FollowerList from '../../../models/followerlist.js';

export const followUser = async (req, res) => {
    const { userId, followerId } = req.params;

    try {
        const followUser = await User.findById(followerId);
        
        const follower = await FollowerList.findById(followUser.followerList);


        follower.followerList = [...follower.followerList, userId];

        await follower.save();

        res.status(200).json({ success: 'new Follow is added' });
    } catch (error) {
        res.status(500).send(error)
    }
};

export const unfollowUser = async (req, res) => {
    const { userId, followerId } = req.params;

    try {
        const follower = await User.findById(followerId);

        const followerList = await FollowerList.findById(followUser.followerList);

        const newFollowerList = followerList.followerList.filter(id => id != userId);
        followerList.followerList = newFollowerList;

        await followerList.save();

        res.status(200).json({ success: 'A Follower unfollowed' });
    } catch (error) {
        res.status(500).send(error)
    }
};

export const getFollowingUserNumber = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId);

        const followerList = await FollowerList.findById(followUser.followerList);

        let returnNumber = followerList.followerList.length;

        if (returnNumber / 1000 > 1 && returnNumber / 1000000 < 1) {
            returnNumber = `${returnNumber / 1000 + (returnNumber % 1000).toFixed(1)} K followers`;
        } else if (returnNumber / 1000 > 1 && returnNumber / 1000000 > 1) {
            returnNumber = `${returnNumber / 1000000 + (returnNumber % 1000000).toFixed(1)} M followers`;
        } else if (returnNumber != 0 && returnNumber != 1) {
            returnNumber = `${returnNumber} followers`;
        } else {
            returnNumber = `${returnNumber} follower`;
        }

        res.json({ followerNumber: returnNumber });
    } catch (error) {
        res.status(500).send(error)
    };
};
