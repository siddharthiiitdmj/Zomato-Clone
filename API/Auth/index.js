// Library

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Model
import { UserModel } from "../../database/user/index";

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
        const user = await UserModel.findByEmailAndPassword(req.body.credentials);
        const token = user.generateJwtToken();
        return res.status(200).json({ token, status: "success" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default Router;
