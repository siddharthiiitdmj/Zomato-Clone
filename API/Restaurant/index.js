// library
import express from "express";

//models
import { RestaurantModel } from "../../database/allmodel";

const Router = express.Router();

/*
Route           /restaurant
desc            to get all restaurants of a city given in req.query
access          public
params          none
method          get
*/
//query(key-value pair) example     http://localhost:4000/?city=jhansi
Router.get("/", async (req, res) => {
    try {
        const { city } = req.query;
        const Restaurants = await RestaurantModel.find({ city });
        return res.status(200).json({ Restaurants: Restaurants });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/*
Route           /restaurant/:_id
desc            to get a restaurant's details on basis of id
access          public
params          _id
method          get
*/
Router.get("/:_id", async (req, res) => {
    try {
        const _id = req.params;
        const Restaurant = await RestaurantModel.findById(_id);
        if (!Restaurant)
            return res.status(404).json({ error: "Restaurant not found" });

        return res.status(200).json({ Restaurant });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/*
Route           /restaurant/search
desc            to get a restaurant's details on basis of search string
access          public
params          none
method          get
*/
//$regex is used to find a substring from an array of strings and i of option suggest that search case in-sensitive
Router.get("/search", async (req, res) => {
    try {
        const { searchString } = req.body;
        const Restaurant = await RestaurantModel.findOne({
            name: { $regex: searchString, $options: "i" },
        });
        if (!Restaurant)
            return res
                .status(404)
                .json({
                    error: `No restaurant name found with name ${searchString}`,
                });
        return res.json({ Restaurant });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default Router;