/*
const express = require('express');
const app = express();
const router = express.Router;
const {Entry} = require('../models/index');
const {sequelize} = require('../db');
const {check, validationResult} = require("express-validator");
const createApplication = require('express/lib/express');
const { application } = require('express');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
sequelize.sync();
//const entriesRouter =

app.use("/entries", )

app.get("/entries", async (request, response) => {
    try{
    const getEntries = await Entry.findAll();
    response.json(getEntries);
    } catch (error){
        console.error();
    }
});

app.get("/entries/:id", async (request, response) => {
    const id = request.params.id;
    try{
    const getOneEntry = await Entry.findByPk(id);
    response.json(getOneEntry);
    } catch(error){
        console.error(error);
    }
});

app.post('/entries', async (request, response) =>{
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

app.put("/entries/:id", async (request, response) => {
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

app.delete('/entries/:id', async (request, response) => {
const id = request.params.id;
try{
const foundEntry = await Entry.findByPk(id);
const deleteEntry = await foundEntry.destroy();
const deleteMessage = `Journal entry ${id} deleted`;
response.json(deletedMessage);
} catch(error){
    console.error(error);
}

});

*/





const express = require('express');
const app = express();
const router = express.Router;
const {Entry} = require('../models/index');
const {sequelize} = require('../db');
const {check, validationResult} = require("express-validator");
app.use(express.json());
//app.use(express.urlencoded({extended:true}));
sequelize.sync();
//const entriesRouter =

//app.use("/entries", )

app.get("/", async (request, response) => {
    const getEntries = await Entry.findAll();
    response.json(getEntries);
   
});

app.get("/:id", async (request, response) => {
    const id = request.params.id;

    const getOneEntry = await Entry.findByPk(id);
    response.json(getOneEntry);
    
});

app.post('/', async (request, response) =>{
    const title = request.params.title;
    const date = request.params.date;
    const text = request.params.text;

    const createEntry = await Entry.create({
        title: title,
        date: date,
        text: text
    });
response.json(createEntry);

});

app.put("/:id", async (request, response) => {
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

    response.json(editEntry);

});

app.delete('/:id', async (request, response) => {
const id = request.params.id;
const foundEntry = await Entry.findByPk(id);
const deleteEntry = await foundEntry.destroy();
const deleteMessage = `Journal entry ${id} deleted`;
response.json(deletedMessage);


});

module.exports = app;