import Express from 'express';
import { 
    writeVideo, 
    getVideo, 
    getVideoList 
} from './function/index.js';

// API Route
const apiRoutes = Express.Router();

// 回傳所有 recipes
// LandingPage before login
apiRoutes.post('/:userId', writeVideo);

apiRoutes.get('/:videoId', getVideo)

apiRoutes.get('/ReelsVideos/:limit', getVideoList);

export default apiRoutes;