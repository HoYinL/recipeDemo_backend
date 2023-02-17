import mongoose from "mongoose";

let Schema = mongoose.Schema;

export default mongoose.model('LandingPageRecipes', new Schema({
    name: String,
    prepTime: Number,
    cookTime: Number,
    stars: Number,
    backgroundImage: String
}))