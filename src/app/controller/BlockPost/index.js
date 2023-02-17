import Express from 'express';
import { 
    blockPost, 
    getBlockedPostList 
} from './function/index.js';

const apiRoutes = Express.Router();

apiRoutes.post(`/:userId/:postId`, blockPost);

apiRoutes.get(`/:userId/`, getBlockedPostList);

export default apiRoutes