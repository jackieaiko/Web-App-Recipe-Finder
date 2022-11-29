const mongoose = require("../db");

const recipeSchema = new mongoose.Schema({
    recipeName: String,
    recipeurl: String,
    decription: String,
    ingredients: [String],
    steps: [String], 
    likes: Number,
    comments: [String]
});

const RecipeInfo = mongoose.model("RecipeInfo", recipeSchema);

module.exports = RecipeInfo;