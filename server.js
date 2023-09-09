
const express = require('express');
const app = express();
const {sequelize} = require('./db');
const seedData = require('./seed')
const journalRouter = require('./routes/journalRoutes');

const port = 8000;


app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/entries', journalRouter);


app.listen(port, () => {
  sequelize.sync()
    console.log(`Listening on port http://localhost:${port}/entries/home`)
});