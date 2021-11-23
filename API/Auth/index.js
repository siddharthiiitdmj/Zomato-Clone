// Library

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Model
import { UserModel } from "../../database/user/index";

const Router = express.Router();

/*
Route           /signup
desc            to signup user
access          public
params          none
method          post
*/
Router.post("/signup", async (req, res) => {
    try {
        const { email, password, fullname, phoneNumber } = req.body.credentials;

        //check if user already exists with same email or phone number
        const checkUserByEmail = await UserModel.findOne({ email });
        const checkUserByNumber = await UserModel.findOne({ phoneNumber });
        if (checkUserByEmail || checkUserByNumber) {
            return res.json({ Error: "User already exists!!" });
        }

        //hashing the password for storing in db
        const bcryptSalt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(password, bcryptSalt);

        //insert to database
        await UserModel.create({
            ...req.body.credentials,
            password: hashedPassword,
        });

        //generate JWT Auth Token
        const token = jwt.sign({ user: { fullname, email } }, "ZomatoSid");

        return res.status(200).json({token, status: "success"})
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
