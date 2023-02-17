import mongoose, { Schema } from 'mongoose';
// 使用 mongoose.model 建立新的資料表，並將 Schema 傳入
// 這邊我們設計了食譜分享的一些基本要素，包括名稱、描述、照片位置等
export default mongoose.model('PublishedFeatures', new Schema({ 
    dish_name: String, 
    description: String, 
    backgroundImg: String,
    _id: Schema.Types.ObjectId,
    tagList: [String], 
}));