import Express from 'express';
import { 
    getWholeMarkedPostList, 
    markPost, 
    unmarkPost, 
    getMarkedPostList 
} from './function/index.js';

// Restful API Route
const apiRoutes = Express.Router();

apiRoutes.post('/:userId/:postId/', markPost);

apiRoutes.get('/:userId/:limit/', getMarkedPostList);

apiRoutes.delete('/:userId/:postId/', unmarkPost);

apiRoutes.get('/:userId/', getWholeMarkedPostList);


export default apiRoutes