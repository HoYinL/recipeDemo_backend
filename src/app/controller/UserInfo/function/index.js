import Express from 'express';
// 引入 jsonwebtoken 套件 
import jwt from 'jsonwebtoken';
// 引入 User、Recipe Model 方便進行資料庫操作
import User from '../../../models/users.js';
import PublishedPostList from '../../../models/publishedpostlist.js';
import SavedPosts from '../../../models/savedposts.js';
import MarkedPostList from '../../../models/markedpostlist.js';
import BlockedPostList from '../../../models/blockedpostlist.js';
import FollowerList from '../../../models/followerlist.js';
import FollowingUserList from '../../../models/followinguserlist.js';
import bcrypt from "bcrypt";
import jwt_decode from "jwt-decode";
import config from '../../../config/index.js';

const app = new Express();

app.set('superSecret', config.secret);

export const registerNewAccount = async (req, res) => {
    const { username, email, password, description, icon } = req.body;

    const newSavedPostList = new SavedPosts({
        _id: new mongoose.Types.ObjectId(),
        postList: [],
    });


    const newPublishedPostList = new PublishedPostList({
        _id: new mongoose.Types.ObjectId(),
        postList: [],
    });


    const newMarkedPostList = new MarkedPostList({
        _id: new mongoose.Types.ObjectId(),
        markedPostList: [],
    });

    const newFollowingUserList = new FollowingUserList({
        _id: new mongoose.Types.ObjectId(),
        followingUserList: [],
    });

    const newFollowerList = new FollowerList({
        _id: new mongoose.Types.ObjectId(),
        followerList: [],
    });

    const newBlockedPostList = new BlockedPostList({
        _id: new mongoose.Types.ObjectId(),
        blockedPostList: [],
    });

    try {
        // If user exists
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) res.status(200).json({ success: false, message: 'Registration failed. Email is already used.' })
        else {
            const savedPostList = await newSavedPostList.save();
            const publishedPostList = await newPublishedPostList.save();
            const markedPostList = await newMarkedPostList.save();
            const followingUserList = await newFollowingUserList.save();
            const followerList = await newFollowerList.save();
            const blockedPostList = await newBlockedPostList.save();

            const user = new User({
                username,
                email,
                icon,
                description,
                admin: false,
                followerList: followerList._id,
                followingUserList: followingUserList._id,
                blockedPostList: blockedPostList._id,
                markedPostList: markedPostList._id,
                blockedPostList: blockedPostList._id,
                savedPostList: savedPostList._id,
                publishedPostList: publishedPostList._id,
                password: bcrypt.hashSync(password, 10),
                _id: new mongoose.Types.ObjectId(),
            });

            const token_payload = {
                username,
                email,
                description,
                icon,
                admin: false,
                id: user._id,
            };

            await user.save();

            const token = jwt.sign({ token_payload }, app.get('superSecret'), { expiresIn: '1m' });
            const refresh_token = jwt.sign({ token_payload }, app.get('superSecret'), { expiresIn: 60 * 60 * 24 }); // expires in 24 hours

            res.status(200).json({
                token_payload,
                token: 'Bearer ' + token,
                refresh_token
            });
        }
    } catch (error) {
        res.status(500).send({ success: false });
    }
};

export const refreshToken = (req, res) => {
    const token = req.cookies["refresh_token"];
    let JwtToken;

    if (token) {
        jwt.verify(token, app.get('superSecret'), () => {
            JwtToken = jwt.sign(jwt_decode(token), app.get('superSecret'), {});
        })

        res.status(200).json({ JwtToken: 'Bearer ' + JwtToken })
    } else {
        res.status(500).send({ success: 'false' });
    };
};

export const authenticate = (req, res) => {
    const token = req.headers['authorization'];

    if (token) {
        res.status(200).json({ token, success: 'success' })
    } else {
        res.status(500).send({ success: 'fail' })
    };
}

export const modifyInfo = async (req, res) => {
    const { username, password, email, icon, description } = req.body;

    const userExits = req.body.modifiedEmail && await User.findOne({ email: email });
    const modifyPassword = (password == '');

    if (userExits) res.status(500).send({ success: 'failed', message: 'email is already used' })

    if (!modifyPassword) {
        await User.findByIdAndUpdate(req.body.id, { email, username, icon: icon, description });
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndDelete(req.body.id, { username, password: hashedPassword, email, icon, description });
    }

    const res_user = { username, email, icon, description };

    res.status(200).json({ success: 'true', user: res_user });
};

export const confirmPassword = async (req, res) => {
    const confirm_password = req.body.password;
    const user = await User.findById(req.body.id);

    bcrypt.compare(confirm_password, user.password)
        .then(success => {
            if (!success) res.send({ success: 'false', message: 'Please enter correct password' })
            else res.status(200).json({ success: 'true' })
        });
};