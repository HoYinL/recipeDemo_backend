import Express from 'express';
import { 
    deleteContent, 
    uploadContent, 
    getContent 
} from './function/index.js';

const apiRoutes = Express.Router();

apiRoutes.post('/', uploadContent);

apiRoutes.get('/:contentId', getContent);

apiRoutes.delete('/:contentId', deleteContent);

export default apiRoutes