// Library
import express from "express";
import passport from "passport";

// Model
import { UserModel } from "../../database/allmodel";

const Router = express.Router();

/*
Route           /auth/signup
desc            to signup user
access          public
params          none
method          post
*/
Router.post("/signup", async (req, res) => {
    try {
        const { email, fullname, phoneNumber } = req.body.credentials;

        await UserModel.checkDuplicateUserByEmailOrPhone(email, phoneNumber);

        //insert to database
        const newUser = await UserModel.create(req.body.credentials);

        //generate JWT Auth Token
        const token = newUser.generateJwtToken();
        return res.status(200).json({ token, status: "success" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/*
Route           /auth/signin
desc            to signin user
access          public
params          none
method          post
*/
Router.post("/signin", async (req, res) => {
    try {
        const user = await UserModel.findByEmailAndPassword(
            req.body.credentials
        );
        const token = user.generateJwtToken();
        return res.status(200).json({ token, status: "success" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/*
Route           /auth/google
desc            to let user select from which google account he wants to sign up/in
access          public
params          none
method          get
*/
Router.get(
    "/google",
    passport.authenticate("google", {
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ],
    })
);

/*
Route           /auth/signin
desc            to receive the sign in/up token after successful authentication of user
access          public
params          none
method          get
*/
Router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        return res.json({ token: req.session.passport.user.token });
    }
);

export default Router;
