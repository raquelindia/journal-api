const express = require('express');
const app = express();
const {Entry} = require('../models/index');
const {sequelize} = require('../db');
const {check, validationResult} = require("express-validator");
const createApplication = require('express/lib/express');
app.use(express.json());
sequelize.sync();

app.get("/entries", async (request, response) => {
    try{
    const getEntries = await Entry.findAll();
    response.json(getEntries);
    } catch (error){
        console.error();
    }
});

app.get("/entry/:id", async (request, response) => {
    const id = request.params.id;
    try{
    const getOneEntry = await Entry.findByPk(id);
    response.json(getOneEntry);
    } catch(error){
        console.error(error);
    }
});

app.post('/entry', async (request, response) =>{
    const title = request.params.title;
    const date = request.params.date;
    const text = request.params.text;
try{
    const createEntry = await Entry.create({
        title: title,
        date: date,
        text: text
    });
response.json(createEntry);
} catch (error){
    console.error(error);
}
});

app.put("/entry/:id", async (request, response) => {
    const id = request.params.id;
    const editTitle = request.body.title;
    const editDate = request.body.date;
    const editText = request.body.text;
try{
    const foundEntry = await Entry.findByPk(id);
    const editEntry = await foundEntry.update({
        title: editTitle,
        date: editDate,
        text: editText
    });

    response.json(editEntry);
}catch (error){
    console.error(error);
}
});

app.delete('/entry/:id', async (request, response) => {
const id = request.params.id;
try{
const foundEntry = await Entry.findByPk(id);
const deleteEntry = await foundEntry.destroy();
const deleteMessage = `Journal entry ${id} deleted`;
response.json(deletedMessage);
} catch(error){
    console.error(error);
}

})



module.exports = app;