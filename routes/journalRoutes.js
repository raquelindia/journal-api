const express = require('express');
const router = express.Router();
const {Entry} = require('../models/Entry');

//Home Page

router.get("/home", async (request, response) => {
    try{
    response.send(`
    <h1>Welcome to Your Journal</h1>
    `);
    } catch(error){
        console.error(error)
        response.status(404).json("Home Not Found");
    }
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
response.status(200).json(deleteMessage);
}catch(error){
        console.error(error);
        response.status(404).json('Could not delete entry');
    }

});

module.exports = router;