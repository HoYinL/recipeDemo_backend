import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from "cors";
import apiRoutes from './app/controller/API/index.js';
import userInfoRoutes from './app/controller/UserInfo/index.js';
import createPostRoutes from './app/controller/CreatePost/index.js';
import publishPostRoutes from './app/controller/PublishPost/index.js';
import editPublishPostRoutes from './app/controller/EditPublsihedPost/index.js';
import savedPostRoutes from './app/controller/SavedPost/index.js';
import markPostRoutes from './app/controller/MarkPost/index.js';
import followRoutes from './app/controller/Follower/index.js';
import followingUserRoutes from './app/controller/FollowingUser/index.js';
import contentRoutes from './app/controller/Content/index.js';
import blockPostRoutes from './app/controller/BlockPost/index.js';
import commentRoutes from './app/controller/Comment/index.js';
import videoRoutes from './app/controller/Video/index.js';
import mongoose from 'mongoose';
import config from './app/config/index.js';
import { connect } from 'mongoose';

const app = express();

 // (2)
app.use(express.static('public'));
app.use(cookieParser());
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ limit: '1000mb', extended: true })); // can only deal with key/value
app.use(bodyParser.json({ limit: '1000mb' }));
// use morgan to log requests to the console
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Routes middlewares
app.use('/api', apiRoutes);
app.use('/video', videoRoutes);
app.use('/userInfo', userInfoRoutes);
app.use('/CreatePost', createPostRoutes); 
app.use('/EditPublishedPost', editPublishPostRoutes);
app.use('/PublishPost', publishPostRoutes);
app.use('/SavePost', savedPostRoutes);
app.use('/MarkPost', markPostRoutes);
app.use('/Follower', followRoutes);
app.use('/FollowUser', followingUserRoutes);
app.use('/Content', contentRoutes);
app.use('/BlockPost', blockPostRoutes);
app.use('/Comment', commentRoutes);

try{
    await connect(config.database);

    const db = mongoose.connection;

    console.log(`connected to ${db} successfully`);

    app.listen(1000, () => console.log('http server is running at port 3000.'));
} catch (err) {
    console.error.bind(console, `MongoDB connection error: ${err}`)
}