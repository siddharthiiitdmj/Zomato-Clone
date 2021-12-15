require("dotenv").config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";

import MongoDB from "./database/connection";

//configs
import googleAuthConfig from './config/google.config';

//Routes
import Auth from "./API/Auth/index";

googleAuthConfig(passport);

const zomato = express();

zomato.use(express.json());
zomato.use(express.urlencoded({ extended: false }));
zomato.use(cors());
zomato.use(helmet());
zomato.use(passport.initialize());
// zomato.use(passport.session());

zomato.get("/", (req, res) => {
    res.json({ message: "Success" });
});

zomato.use("/auth", Auth);
// zomato.use("/restaurant", Restaurant);

zomato.listen(4000, () =>
    MongoDB()
        .then(() => console.log("Server is running and connected to mongodb"))
        .catch(() =>
            console.log("Server is running but failed to connect to mongodb")
        )
);
