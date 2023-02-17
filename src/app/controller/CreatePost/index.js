import Express from 'express';
import { 
  saveContent, 
  getSavedContent, 
  emptyPostContent, 
  deleteSavedContent, 
  getExistingPost, 
  saveNewPost, 
  saveExistingPost,
  getNewPost
} from './function/index.js';

// API Route
const apiRoutes = Express.Router();

// 設定 JSON Web Token 的 secret variable

apiRoutes.get('/surfaceUI/CreatePost/:userId', getNewPost);

apiRoutes.post('/surfaceUI/CreatePost/:userId/', saveNewPost);

apiRoutes.get('/surfaceUI/CreatePost/:userId/:postId', getExistingPost);

apiRoutes.post('/surfaceUI/CreatePost/:userId/:postId', saveExistingPost);

apiRoutes.delete('/surfaceUI/CreatePost/:userId/:postId', emptyPostContent);

apiRoutes.get('/:contentId', getSavedContent);

apiRoutes.delete('/:contentId', deleteSavedContent);

apiRoutes.post('/', saveContent);

export default apiRoutes