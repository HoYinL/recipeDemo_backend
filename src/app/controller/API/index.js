import Express from 'express';
import { 
    sortPost, 
    sortUser, 
    getBlogContent, 
    getUserInfo, 
    getContributers, 
    getComment,
    getRecipes 
} from './function/index.js';
// API Route
const apiRoutes = Express.Router();

apiRoutes.get(`/surfaceUI/SortUser/`, sortUser);

apiRoutes.get(`/surfaceUI/SortPost`, sortPost);

apiRoutes.get('/surfaceUI/Blog/:id', getBlogContent);

apiRoutes.get(`/surfaceUI/User/:userId`, getUserInfo);

apiRoutes.get('/contributers', getContributers);

apiRoutes.get('/recipes', getRecipes);

apiRoutes.get('/comment', getComment);

export default apiRoutes