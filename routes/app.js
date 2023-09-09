const express = require('express');
const router = express.Router();
const app = express();
const {Entry} = require('../models/index');
const {sequelize} = require('sequelize');
//const {db} = require('./db');
//const {check, validationResult} = require("express-validator");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//sequelize.sync();
//const entriesRouter =
app.use("/entries", router);

// error handling middleware
app.use((error, req, res, next) => {
    console.error("SERVER ERROR: ", error);
    if (res.statusCode < 400) res.status(500);
    res.send({
      error: error.message,
      name: error.name,
      message: error.message,
      table: error.table,
    });
  });


router.get("/", async (request, response) => {
    try{
    const getEntries = await Entry.findAll();
    response.status(200).json(getEntries);
    } catch(error){
        console.error(error);
        response.status(404).json('Could not find entries')
    }
    
});

router.get("/:id", async (request, response) => {
    try{
    const id = request.params.id;
    const getOneEntry = await Entry.findByPk(id);
    response.status(200).json(getOneEntry);
    } catch(error){
        console.error(error);
        response.status(404).json('Could not find entry');
    }
});

router.post('/', async (request, response) =>{
    try{
    const title = request.body.title;
    const date = request.body.date;
    const text = request.body.text;

    const createEntry = await Entry.create({
        title: title,
        date: date,
        text: text
    });
response.status(200).json(createEntry);
    } catch(error){
        console.error(error);
        response.status(404).json('Could not POST entry');
    }

});

router.put("/:id", async (request, response) => {
    try{
    const id = request.params.id;
    const editTitle = request.body.title;
    const editDate = request.body.date;
    const editText = request.body.text;

    const foundEntry = await Entry.findByPk(id);
    const editEntry = await foundEntry.update({
        title: editTitle,
        date: editDate,
        text: editText
    });

    response.status(200).json(editEntry);
}catch(error){
    console.error(error);
    response.status(404).json('could not update entry');
}

});

router.delete('/:id', async (request, response) => {
    try{
const id = request.params.id;
const foundEntry = await Entry.findByPk(id);
const deleteEntry = await foundEntry.destroy();
const deleteMessage = `Journal entry ${id} deleted`;
response.status(200).json(deletedMessage);
}catch(error){
        console.error(error);
        response.status(404).json('Could not delete entry');
    }

});

module.exports = router,
app;