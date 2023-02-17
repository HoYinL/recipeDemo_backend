import Express from 'express';
import { 
    getFollowingUserList, 
    extendFollowingUserList, 
    getWholeFollowingUserList, 
    reduceFollowingUserList 
} from './function/index.js';

// API Route
const apiRoutes = Express.Router();

apiRoutes.get('/:userId/:limit', getFollowingUserList);

apiRoutes.post('/:userId/:followUserId', extendFollowingUserList);

// Read own followingUserList list
apiRoutes.get('/:userId/', getWholeFollowingUserList);

apiRoutes.delete('/:userId/:followUserId', reduceFollowingUserList);

export default apiRoutes
