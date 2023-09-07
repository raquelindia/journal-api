const express = require('express');
const port = 8000;
const app = express();
const {sequelize} = require('./db');
const {Entry} = require("./models/index")

app.use(express.json());
sequelize.sync();
const routes = require('./routes/app');

app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`)
});


/*
const { db } = require('./models');
const app = require('./routes/app');

const PORT = process.env.PORT || 4000;

const init = async () => {
    try {
        await db.sync();

        app.listen(PORT, () => {
            console.log(`Server listening at http://localhost:${PORT}`);

        });


    } catch(error){
        console.error('Error starting server:', error)
    }
}; 

init();

*/