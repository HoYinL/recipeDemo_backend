import mongoose from 'mongoose';
// 使用 mongoose.model 建立新的資料表，並將 Schema 傳入
// 這邊我們設計了使用者的一些基本要素，包括名稱、描述、照片位置等
let Schema = mongoose.Schema;

export default mongoose.model('User', new Schema({ 
    id: Number,
    username: String, 
    email: String,
    password: String, 
    admin: Boolean,
    icon: String, 
    description: String,
    savedPostList: {type: Schema.Types.ObjectId, ref: 'savedPost'},
    publishedPostList: {type: Schema.Types.ObjectId, ref: 'PublishedPostList'},
    markedPostList: {type: Schema.Types.ObjectId, ref: 'MarkedPostList'},
    blockedPostList: {type: Schema.Types.ObjectId, ref: 'BlockedPostList'},
    followingUserList: {type: Schema.Types.ObjectId, ref: 'FollowingUserList'},
    followerList: {type: Schema.Types.ObjectId, ref: 'FollowerList'},
}));