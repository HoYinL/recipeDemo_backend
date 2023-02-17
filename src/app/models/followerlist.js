import mongoose, { Schema } from 'mongoose';
// 使用 mongoose.model 建立新的資料表，並將 Schema 傳入
// 這邊我們設計了食譜分享的一些基本要素，包括名稱、描述、照片位置等
export default mongoose.model('FollowerList', new Schema({ 
    _id: Schema.Types.ObjectId,
    followerList: [{type: Schema.Types.ObjectId, ref: 'User'}],
}));