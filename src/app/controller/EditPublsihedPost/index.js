import Express from 'express';
import { EditPublishedPost, getPublishedPost } from './function/index.js';

// API Route
const apiRoutes = Express.Router();

apiRoutes.get('/surfaceUI/EditPublishedPost/:userId/:postId', getPublishedPost);

apiRoutes.post('/surfaceUI/EditPublishedPost/:userId/:postId', EditPublishedPost);

export default apiRoutes