const express = require('express');
const app = express();
const {Entry} = require('../models/index');
const {sequelize} = require('../db');
const {check, validationResult} = require("express-validator");
const createApplication = require('express/lib/express');
app.use(express.json());
sequelize.sync();

app.get("/entries", async (request, response) => {
    const getEntries = await Entry.findAll();
    response.json(getEntries);
});

app.get("/entry/:id", async (request, response) => {
    const id = request.params.id;
    const getOneEntry = await Entry.findByPk(id);
    response.json(getOneEntry);
});

app.post('/entry', async (request, response) =>{
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

app.put("/entry/:id", async (request, response) => {
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

app.delete('/entry/:id', async (request, response) => {
const id = request.params.id;
const foundEntry = await Entry.findByPk(id);
const deleteEntry = await foundEntry.destroy();
const deleteMessage = `Journal entry ${id} deleted`;
response.json(deletedMessage);

})



module.exports = app;