import Express from 'express';
import { 
    commentPost, 
    getCommentList, 
    getComment
} from './function/index.js';

const apiRoutes = Express.Router();

apiRoutes.post(`/:userId/:postId/`, commentPost);

apiRoutes.get(`/:postId/:limit`, getCommentList);

apiRoutes.get(`/:commentId/`, getComment);

export default apiRoutes