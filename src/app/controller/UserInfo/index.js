import Express from 'express';
import { signJWT } from '../../authentication/api.js';
import passport from 'passport';
import config from '../../config/index.js';
import { 
    registerNewAccount, 
    refreshToken, 
    authenticate, 
    modifyInfo, 
    confirmPassword 
} from './function/index.js';

// API Route
const app = new Express();
const apiRoutes = Express.Router();

// 設定 JSON Web Token 的 secret variable
app.set('superSecret', config.secret);

apiRoutes.post('/login', passport.authenticate('login', { session: false }), signJWT)

apiRoutes.post('/register', registerNewAccount);

//UserIcon
apiRoutes.post('/refreshToken', refreshToken);

// 確認認證是否成功
apiRoutes.get('/authenticate', passport.authenticate('jwt', { session: false }), authenticate);

apiRoutes.post('/confirmPassword', confirmPassword);

apiRoutes.post('/modifyInfo', modifyInfo);

export default apiRoutes;