// library
import express from "express";

//models
import { FoodModel } from "../../database/allmodel";

const Router = express.Router();

/*
Route           /food/r/:_id
desc            to get all food items of a restaurant whose id is given in req.params
access          public
params          _id
method          get
*/
Router.get('/r/:_id', async (req, res) => {
    try {
        const {_id} = req.params;
        const Foods = await FoodModel.find({restaurant: _id});
        if(!Foods)
        return res.status(404).json({error: `No food item related to given Restaurant id ${_id}`});
        return res.status(200).json({Foods});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

/*
Route           /food/c/:category
desc            to get all food items of a category given in req.params
access          public
params          category
method          get
*/
Router.get('/c/:category', async (req, res) => {
    try {
        const {category} = req.params;
        const Foods = await FoodModel.find({category});
        if(!Foods)
        return res.status(404).json({error: `No food item related to given category ${category}`});
        return res.status(200).json({Foods});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

export default Router;