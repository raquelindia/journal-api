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

