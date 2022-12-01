const express = require("express");
const app = express();


app.use(express.urlencoded({
    extended: true
}));

app.set("view engine", "ejs");

app.use(express.static("public"));


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


// create profile name
app.post("/profilecreated", (req, res) => {

    let result = ProfileInfo(
        {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            backgroundColor: "white",
            savedRecipes: []
        });

    result.save(
        (err, result) => {
            if (err) {
                //note that we are not handling this error! You'll want to do this yourself!
                return console.log("Error: " + err);
            }
            console.log(`Success! Inserted data with _id: ${result._id} into the database.`);
            res.redirect("/profilecreated");
        });
});

app.get("/profilecreated", (req, res) => {

    //Using the static model method to query the database
    ProfileInfo.find(
        {},
        (err, results) => {
            console.log(results)
            res.render("profilecreated.ejs/", {
                formResults: results
            });
        });
});

// modify background color and saved favorites
app.route("/editprofile/:_id")

    .get((req, res) => {
        let id = req.params._id;
        console.log(id)

        ProfileInfo.find(
            {},
            (err, results) => {
                console.log("Found result: ");
                console.log(results)

                let result = {
                    _id: id,
                    firstName: results.firstName,
                    lastName: results.lastName
                };

                res.render("editprofile.ejs", {
                    response: result
                });
            });

    })

    .post(function (req, res) { 
        console.log("posted")
        let id = req.params._id;
        let backgroundColor = req.body.backgroundColor;
        let savedRecipes = req.body.savedRecipes;

        ProfileInfo
            .where({ _id: id })
            .updateOne({
                $set: {
                    backgroundColor: backgroundColor
                },
                $push: {
                    savedRecipes: savedRecipes
                }
            })
            .exec(function (err, result) {
                if (err) return res.send(err);
                res.redirect("/profilecreated");
                console.log(`Successfully updated ${result.modifiedCount} record`);
            });
});











// go to recipe
app.post("/recipe", (req, res) => {

    console.log(req.body.recipeName)
    //Using the static model method to query the database
    RecipeInfo.find(
        {"recipeName": req.body.recipeName},
        (err, results) => {
            console.log(results)
            res.render("recipe.ejs/", {
                recipeResults: results
            });

        });
});


app.get("/recipe", (req, res) => {

    //Using the static model method to query the database
    RecipeInfo.find(
        {"recipeName": req.body.recipeName},
        (err, results) => {
            console.log(results)
            res.render("recipe.ejs/", {
                recipeResults: results
            });

        });
});




// modify recipe
app.route("/recipeedit/:_id")

    .get((req, res) => {
        let id = req.params._id;
        console.log(id)

        RecipeInfo.find(
            {_id: id},
            (err, results) => {
                console.log("Found result: ");
                console.log(results)

                res.render("recipeedit.ejs", {
                    response: results[0]
                });
            });

    })

    .post(function (req, res) { 
        console.log("posted")
        let id = req.params._id;
        let likes = req.body.likes;
        let comments = req.body.comments;

        console.log(likes)

        RecipeInfo
            .where({ _id: id })
            .updateOne({
                $set: {
                    likes: parseInt(likes)
                },
                $push: {
                    comments: comments
                }
            })
            .exec(function (err, result) {
                if (err) return res.send(err);
                res.redirect("/recipe");
                console.log(`Successfully updated ${result.modifiedCount} record`);
            });
});



