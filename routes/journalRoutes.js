const express = require('express');
const router = express.Router();
const {Entry} = require('../models/index');
const { SuperAdmin } = require('../models');
const {User} = require('../models/index')
const jwt = require('jsonwebtoken');


//Home Page

router.get("/home", async (request, response) => {
    try{
    response.status(200).send(`
    <h1>Welcome to Your Journal</h1>
    <h2>Log in at entries/login</h2>
    `);
    } catch(error){
        console.error(error)
        response.status(404).json("Home Not Found");
    }
});

//super admin view of all users
router.get('/users', async (request, response) => {
    try{
        const userEmail = request.oidc.user.email;
        if(request.oidc.isAuthenticated()){
            const superAdmin = await SuperAdmin.findAll({
                where: {
                    email: userEmail
                }
            });
            if(superAdmin.length > 0 ){
                const users = User.findAll();
                response.status(200).json(users);
            } else {
                response.status(404).send('Unauthorized');
            }
        } else {
            response.status(200).send('Please log in');
        }

    } catch(error){
        console.error(error);
        response.status(404).send('Cannot find users');
    }
})


//Give access to all entries to SuperAdmin only **works**
router.get("/all", async (request, response) => {
    try{
        const userEmail = request.oidc.user.email;
        console.log(userEmail);
        if(request.oidc.isAuthenticated()){
        const superAdmin = await SuperAdmin.findAll({
            where: {
                email: userEmail
            }
        });
        if (superAdmin.length > 0){
    const entries = await Entry.findAll();
    response.status(200).json(entries);
        } else {
            response.status(401).send('Unauthorized');
        }
    } else {
        response.status(200).send('Please log in');
    }
    } catch(error){
        console.error(error);
        response.status(404).send('error');
    }
    
});


//Give access to all entries by id SuperAdmin only **works**
router.get("/:id", async (request, response) => {
    try{
        const id = request.params.id;
        const userEmail = request.oidc.user.email;
        if(request.oidc.isAuthenticated()){
            const superAdmin = await SuperAdmin.findAll({
                where: {
                    email: userEmail
                }
            });
            if (superAdmin.length > 0){
                const getOneEntry = await Entry.findAll({
                    where: {
                    id
                    }
                });
                response.status(200).json(getOneEntry);
                    } else {
                        response.status(401).send('Unauthorized');
                    }
            
    } else {
        response.status(200).send('Please log in');
    }
    } catch(error){
        console.error(error);
        response.status(404).json('Could not find entry');
    }
});

//super admin edit endpoint
router.put("/:id", async (request, response) => {
    try{
        const userEmail = request.oidc.user.email;
        if(request.oidc.isAuthenticated()){
            const superAdmin = await SuperAdmin.findAll({
                where: {
                    email: userEmail
                }
            });
            if(superAdmin.length > 0){
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
} else {
    response.status(401).send('Unauthorized');
}
} else {
    response.status(401).send('Please log in');
}
}catch(error){
    console.error(error);
    response.status(404).json('could not update entry');
}

});


//super admin delete endpoint 
router.delete('/:id', async (request, response) => {
    try{
        if(request.oidc.isAuthenticated()){
            const userEmail = request.oidc.user.email
            const superAdmin = SuperAdmin.findAll({
                where: {
                    email: userEmail
                }
            });
            if(superAdmin.length > 0){
const id = request.params.id;
const foundEntry = await Entry.findByPk(id);
const deleteEntry = await foundEntry.destroy({
    where: {
        id
    }
});
const deleteMessage = `Journal entry ${id} deleted`;
response.status(200).json(deleteMessage);
    } else {
        response.status(401).send('Access not authorized');
    }
} else {
    response.status(401).send('Please log in');
}
}catch(error){
        console.error(error);
        response.status(404).json('Could not delete entry');
    }

}); 



//user create entry endpoint
router.post('/', async (request, response) =>{
    try{
         const user = request.oidc.user;
        if(request.oidc.isAuthenticated()){
    const title = request.body.title;
    const date = request.body.date;
    const text = request.body.text;

    const createEntry = await Entry.create({
        title: title,
        date: date,
        text: text
    });


response.status(200).json(createEntry);
        } else {
            response.status(401).send('Please log in');
        }
    } catch(error){
        console.error(error);
        response.status(404).json('Could not POST entry');
    }

});



module.exports = router;