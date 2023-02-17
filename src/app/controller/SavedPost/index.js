import Express from 'express';
import { 
    getSavedPostFeatures, 
    deleteSavedPost, 
    getSavedPostList 
} from './function/index.js';

// API Route
const apiRoutes = Express.Router();

apiRoutes.get('/:userId/:limit/', getSavedPostList);

apiRoutes.delete('/:userId/:postId/', deleteSavedPost);

apiRoutes.get(`/SavedPost/Features/:postId/`, getSavedPostFeatures);

export default apiRoutes