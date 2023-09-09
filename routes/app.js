const express = require('express');
const app = express();
const router = express.Router();
const {Entry} = require('../models/index');
const {sequelize} = require('../db');
const {check, validationResult} = require("express-validator");
app.use(express.json());
//app.use(express.urlencoded({extended:true}));
sequelize.sync();
//const entriesRouter =

app.use("/entries", router);

router.get("/entries", async (request, response) => {
    const getEntries = await Entry.findAll();
    response.json(getEntries);
});

router.get("/:id", async (request, response) => {
    const id = request.params.id;
    const getOneEntry = await Entry.findByPk(id);
    response.json(getOneEntry);
});

router.post('/', async (request, response) =>{
    const title = request.body.title;
    const date = request.body.date;
    const text = request.body.text;

    const createEntry = await Entry.create({
        title: title,
        date: date,
        text: text
    });
response.json(createEntry);

});

router.put("/:id", async (request, response) => {
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

router.delete('/:id', async (request, response) => {
const id = request.params.id;
const foundEntry = await Entry.findByPk(id);
const deleteEntry = await foundEntry.destroy();
const deleteMessage = `Journal entry ${id} deleted`;
response.json(deletedMessage);


});

module.exports = {
    app
};