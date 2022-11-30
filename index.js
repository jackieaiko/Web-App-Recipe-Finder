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
const { populate } = require("./models/recipeinfo");

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

// modify background color
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





app.post("/recipe", (req, res) => {

    console.log(req.body.recipeName)
    //Using the static model method to query the database
    RecipeInfo.find(
        {"recipeName": req.body.recipeName},
        (err, results) => {
            console.log(results._id)
            res.render("recipe.ejs/", {
                recipeResults: results
            });
        });
});

app.get('/recipe/:recipeName', (req, res) => {
    let recipeName = req.params.recipeName
    console.log(recipeName)
    //Using the static model method to query the database
    RecipeInfo.find(
        {"recipeName": recipeName},
        (err, results) => {
            if (err) console.log("error: " + err)
            console.log(results)
            console.log(results._id)
            console.log(results.recipeurl)

            for (let i = 0; i < results.length; i++) {
                results[i].recipeurl = 'public/'+results[i].recipeurl
            }
            res.render("recipe.ejs/", {
                recipeResults: results
            });
        });
})

app.post("/comments/:_id", (req, res) => {

    console.log(1)
    console.log(req.body.comments)
    console.log(req.params._id)

    // let recipe = RecipeInfo(
    //     {
    //         _id: req.params._id
    //     }
    // )
    let recipe = RecipeInfo.findOne({_id: _id})

    let comments = recipe.comments
    comments.push(req.body.comments)

    RecipeInfo.findByIdAndUpdate(req.params._id, {comments: comments}, (err, result) => {
        if (err) {
            return console.log('Error: ' + err)
        }
        console.log("a random result!!!" +result.recipeName)
        res.redirect(200, "/recipe/" + result.recipeName)
    })

    // recipe.comments.push(req.body.comments)
    // recipe.fetchOneAndUpdate(
    //     (err, result) => {
    //         if (err) {
    //             return console.log('Error: ' + err)
    //         }
    //         res.redirect(200, "/recipe/" + result.recipeName)
    //     }
    // )
    //Using the static model method to query the database
    // RecipeInfo.find(
    //     {"recipeName": req.body.recipeName},
    //     (err, results) => {
    //         console.log(results)
    //         res.render("recipe.ejs", {
    //             recipeResults: results
    //         });
    //     });
    // res.render("recipe.ejs");
});

// app.route("/recipe/:_id", (req, res) => {

//     // let result = RecipeInfo(
//     //     {
//     //         comments: req.body.comments
//     //     });

//     // RecipeInfo.updateOne( {
//     //     $push: {
//     //         comments: req.body.comments
//     // }
//     // });
//     console.log(1);
//     console.log(req.body.comments);
//     console.log(req.body.recipeName);

//     // result.save(
//     //     (err, result) => {
//     //         if (err) {
//     //             //note that we are not handling this error! You'll want to do this yourself!
//     //             return console.log("Error: " + err);
//     //         }
//     //         console.log(`Success! Inserted data with _id: ${result._id} into the database.`);
//     //         res.redirect("/profile");
//     //     });
// });