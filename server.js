const express = require('express');
const app = express();
const {sequelize} = require('./db');
const seedData = require('./seed')
const journalRouter = require('./routes/journalRoutes');
const { auth } = require('express-openid-connect');
const { User } = require('./models/User.js');
const {jwt} = require('jsonwebtoken');
const path = require('path');



//Error handling middleware
require('dotenv').config('.env');
const cors = require('cors');
const morgan = require('morgan');


//middleware 
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
 

//Auth0 config
app.use(
  auth({
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,

}));


//Routes
app.use('/entries', journalRouter);


//add user to database 

app.use(async (request, response, next) => {
  if(request.oidc.user){
    const [user] = await User.findOrCreate({
      where: {
        username: request.oidc.user.nickname,
        name: request.oidc.user.name,
        email: request.oidc.user.email
      }
    });
  }
  next();
});





app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  sequelize.sync()
    console.log(`Listening on port http://localhost:${port}/entries/home`)
});