// library
import express from "express";

//models
import { MenuModel, ImageModel } from "../../database/allmodel";

const Router = express.Router();

/*
Route           /menu/list
desc            to get list of menu using _id in req.params
access          public
params          none
method          get
*/
Router.get('/list/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        const menu = await MenuModel.findById(_id);
        if(!menu)
        return res.status(404).json({error: "No such menu exists"});
        return res.status(200).json({menu});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

/*
Route           /menu/image
desc            to get images of menu using _id in req.params
access          public
params          none
method          get
*/
Router.get('/image/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        const images = await ImageModel.findById(_id);
        if(!images)
        return res.status(404).json({error: "No such image exists"});
        return res.status(200).json({images});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});