import Express from "express";
import passport from "passport";
import passportJwt, { ExtractJwt } from "passport-jwt"
import passportLocal from "passport-local"
import User from "../models/users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import config from "../config/index.js";

dotenv.config();

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJwt.Strategy

const app = Express();
app.set("superSecret", config.secret);

const checkPassword = async (user, password) => {
    try {
        const result = await bcrypt.compare(password, user.password);

        return result ? Promise.resolve(user) : Promise.resolve(result)
    } catch (err) {
        console.log(err);
    }
}

passport.use('login', new LocalStrategy(async (username, password, done) => {

    try {
        const user = await User.findOne({ email: username});

        if(!user)
            done(null, 'username');
        else {
            const message = await checkPassword(user, password);

            message? done(null, user) : done(null, 'password');
        }
    } catch (err) {
        console.log(err);
    }
}))

passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        secretOrKey: app.get('superSecret')
    },

    async (jwtPayload, done) => {
        try {
            await User.findById(jwtPayload._id);

            done(null, jwtPayload)
        } catch (err) {
            done(err);
        }
    }
))

export const signJWT = (req, res) => {
    if(req.user){
        const user = req.user;

        if(req.user == 'password'){
            res.send({success: false, type: 'password', message: 'Authorization failed. Wrong password'})
        } else if(req.user == 'username'){
            res.send({success: false, type: 'username', message: 'Authorization failed. Non-exist Email'})
        } else {
            const token_payload = {
                username: user.username,
                email: user.email,
                id: user._id,
                isAdmin: user.admin,
                icon: user.icon
            }

            const token = jwt.sign({token_payload}, app.get('superSecret'), {expiresIn: 60 * 1})

            const refresh_token = jwt.sign({token_payload}, app.get('superSecret'), {
                expiresIn: 60 * 60 * 24 // expires in 24 hours
            });
      
            res.cookie('refresh_token', refresh_token, { maxAge: 60 * 60 * 24 } ).send({
                success: true,
                user,
                refresh_token,
                token: 'Bearer ' + token,
            });
        }
        return 
    } 
}