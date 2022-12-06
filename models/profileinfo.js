const mongoose = require("../db");

const profileSchema = new mongoose.Schema({
    firstName: {type: String, default: ""},
    lastName: {type: String, default: ""},
    backgroundColor: {type: String},
    savedRecipes: [String],
});

const ProfileInfo = mongoose.model("ProfileInfo", profileSchema);

module.exports = ProfileInfo;