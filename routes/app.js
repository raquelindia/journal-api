const express = require('express');
const app = express();
const {Entry} = require('../models/index');
const {sequelize} = require('../db');
const {check, validationResult} = require("express-validator");
app.use(express.json());
sequelize.sync();

app.get("/", async (request, response) => {
    const getEntries = await Entry.findAll();
    response.json(getEntries);
});

app.get("/:id", async (request, response) => {
    const id = request.params.id;
    const getOneEntry = await Entry.findByPk(id);
    response.json(getOneEntry);
});


/*
router.put('/', async (request, response) =>{
    const id = reques.params.body;


})
*/

module.exports = app;