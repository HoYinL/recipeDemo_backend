import mongoose from 'mongoose';
// 使用 mongoose.model 建立新的資料表，並將 Schema 傳入
// 這邊我們設計了使用者的一些基本要素，包括名稱、描述、照片位置等
let Schema = mongoose.Schema;

export default mongoose.model('UserIcon', new Schema({ 
    _id: Schema.Types.ObjectId,
    icon: String, 
}))