const express = require("express");
const app = express();


app.use(express.urlencoded({
    extended: true
}));

app.set("view engine", "ejs");

app.use(express.static("public"));

// app.use("/api/profile", require("./api/profile"));

const PORT = process.env.PORT || 8080; 

app.listen(PORT, function () {
    console.log("Server listening on port " + PORT);
});

// configre mongoose
const RecipeInfo = require("./models/recipeinfo");
const ProfileInfo = require("./models/profileinfo");

// root path
app.get("/home", (req, res) => {
    res.render("home.ejs");
});

// direct to profile page
app.get("/profile", (req, res) => {
    res.render("profile.ejs");
});


app.post("/recipe", (req, res) => {

    console.log(req.body.recipeName)
    //Using the static model method to query the database
    RecipeInfo.find(
        {"recipeName": req.body.recipeName},
        (err, results) => {
            console.log(results)
            res.render("recipe.ejs", {
                recipeResults: results
            });
        });
});


app.post("/profile", (req, res) => {

    let result = ProfileInfo(
        {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            backgroundColor: req.body.backgroundColor
        });

    result.save(
        (err, result) => {
            if (err) {
                //note that we are not handling this error! You'll want to do this yourself!
                return console.log("Error: " + err);
            }
            console.log(`Success! Inserted data with _id: ${result._id} into the database.`);
            res.redirect("/profile");
        });
});



app.put("recipe/:recipeName", (req, res) => {

    // let result = RecipeInfo(
    //     {
    //         comments: req.body.comments
    //     });

    RecipeInfo.updateOne( {
        $push: {
            comments: req.body.comments
    }
    });

    console.log(req.body.comments);
    console.log(req.body.recipeName);

    // result.save(
    //     (err, result) => {
    //         if (err) {
    //             //note that we are not handling this error! You'll want to do this yourself!
    //             return console.log("Error: " + err);
    //         }
    //         console.log(`Success! Inserted data with _id: ${result._id} into the database.`);
    //         res.redirect("/profile");
    //     });
});