import mongoose from "mongoose";

let Schema = mongoose.Schema;

export default mongoose.model('Contributer', new Schema({
    name: String,
    follower: Number,
    backgroundImage: String,
}))