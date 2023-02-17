import Express from 'express';
import { 
  publishPost, 
  getPublishedPostList, 
  getPublishedPostFeatures, 
  deletePublishedPost,
  getPublishedPostContent, 
  getPublishedPostAuthor,
  getPosts
} from './function/index.js';

// Restful API Route
const apiRoutes = Express.Router();

apiRoutes.post('/:userId/', publishPost);

apiRoutes.get('/:userId/:limit/', getPublishedPostList);

apiRoutes.get('/:limit', getPosts);

apiRoutes.delete('/:userId/:postId/', deletePublishedPost);

apiRoutes.get(`/PublishedPost/Content/:postId/`, getPublishedPostContent);

apiRoutes.get(`/PublishedPost/Features/:postId/`, getPublishedPostFeatures);

apiRoutes.get(`/PublishedPost/Author/:postId/`, getPublishedPostAuthor);

export default apiRoutes