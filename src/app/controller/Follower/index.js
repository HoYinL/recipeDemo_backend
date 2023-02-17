import Express from 'express';
import { 
    followUser,
    unfollowUser,
    getFollowingUserNumber
} from './function/index.js';

// API Route
const apiRoutes = Express.Router();

/* FollowerList CRUD */
// Create empty own FollowerList
//C
//apiRoutes.post('/:userId/Follower/:followerId', extendFollowerList);
apiRoutes.post('/:userId/:followerId', followUser);

//apiRoutes.delete('/:userId/Follower/:followerId', reduceFollowerList);
apiRoutes.delete('/:userId/:followerId', unfollowUser);

//apiRoutes.get('/:userId/GetFollowerNumber/', getFollowerNumber);
apiRoutes.get('/:userId/', getFollowingUserNumber);

export default apiRoutes