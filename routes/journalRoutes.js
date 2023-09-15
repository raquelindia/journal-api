const express = require('express');
const router = express.Router();
const {Entry} = require('../models/index');
const { SuperAdmin } = require('../models');
const {User} = require('../models/index')
const jwt = require('jsonwebtoken');




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
                const users = await User.findAll();
                //check if users exist
                if(users.length > 0){
                    response.status(200).json(users);
                } else {
                    response.status(404).send('Users not found');
                }
                
            } else {
                response.status(403).send('Unauthorized');
            }
        } else {
            response.status(200).send('Please log in');
        }

    } catch(error){
        console.error(error);
        response.status(500).send('Internal Server Error');
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
    //check if entries exist 
    if(entries.length > 0 ){
    response.status(200).json(entries);
    } else {
        response.status(404).send('No entries found');
    }
        } else {
            response.status(403).send('Unauthorized');
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
router.get("/all/:id", async (request, response) => {
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

                if(getOneEntry.length > 0){
                response.status(200).json(getOneEntry);
                } else {
                    response.status(404).send('Entry not found');
                }
                    } else {
                        response.status(403).send('Unauthorized');
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
router.put("/all/:id", async (request, response) => {
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
    //check if entry exists
    if (foundEntry){
    const editEntry = await foundEntry.update({
        title: editTitle,
        date: editDate,
        text: editText
    });

    response.status(200).json(editEntry);
} else {
    response.status(404).send('Entry not found');
}
} else {
    response.status(403).send('Unauthorized');
}
} else {
    response.status(401).send('Please log in');
}
}catch(error){
    console.error(error);
    response.status(500).json('Internal Server Error');
}

});


//super admin delete endpoint 
router.delete('/all/:id', async (request, response) => {
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
//check if entry exists
if (foundEntry){
const deleteEntry = await foundEntry.destroy();
const entryTitle = foundEntry.title;
const deleteMessage = `Journal entry ${entryTitle} deleted`;
response.status(200).json(deleteMessage);
} else {
    response.status(200).send('Entry not found');
}
    } else {
        response.status(403).send('Unauthorized');
    }
} else {
    response.status(401).send('Please log in');
}
}catch(error){
        console.error(error);
        response.status(500).json('Internal Server Error');
    }

}); 



module.exports = router;