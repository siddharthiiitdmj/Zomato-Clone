require("dotenv").config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import MongoDB from "./database/connection";

const zomato = express();

zomato.use(express.json());
zomato.use(express.urlencoded({ extended: false }));
zomato.use(cors());
zomato.use(helmet());

zomato.get("/", (req, res) => {
    res.json({ message: "Success" });
});

zomato.listen(4000, () =>
    MongoDB()
        .then(() => console.log("Server is running and connected to mongodb"))
        .catch(() =>
            console.log("Server is running but failed to connect to mongodb")
        )
);
