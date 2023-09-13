const express = require('express');
const app = express();
const {sequelize} = require('./db');
const bodyParser = require('body-parser');
const seedData = require('./seed')
const journalRouter = require('./routes/journalRoutes');
const { auth } = require('express-openid-connect');
const { User } = require('./models/User.js');
const {Entry} = require('./models/Entry');
const {jwt} = require('jsonwebtoken');
const path = require('path');
const auth0 = require('auth0');
const { AuthenticationClient } = require('auth0');
const crypto = require('crypto');
const jwtSecret = crypto.randomBytes(32).toString('hex'); // 32 bytes (256 bits) is a common choice
console.log(jwtSecret);



//Error handling middleware
require('dotenv').config('.env');
const cors = require('cors');
const morgan = require('morgan');


//middleware 
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

 
//JWT secret
const {JWT_SECRET = 'neverTell'} = process.env; 

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

// Express middleware for parsing JSON requests
app.use(bodyParser.json());



//Routes
app.use('/entries', journalRouter);


app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 
  `<h2>Welcome, ${req.oidc.user.name}</h2>
  <p><b>Username: ${rew.oidc.user.nickname}</b></p>
  <p>${req.oidc.user.email}</p>
  <img src="${req.oidc.user.picture}" alt="${req,oidc.user.name}">
  ` : 'Logged out');
});



app.get('/logout', (req, res) => {
  const returnTo = req.query.returnTo || '/authorize';
  res.redirect(returnTo);

})

app.get('/login', (req, res) => {

  const returnTo = req.query.returnTo || '/home';
  res.redirect(returnTo);
});

app.use(async (req, res, next) => {
  const username = req.oidc.user.nickname;
  const name = req.oidc.user.name;
  const email =  req.oidc.user.email;

  if(req.oidc.user) {

    const [user] = await User.findOrCreate({
      where: {
        username: username,
        name: name,
        email: email
      }
    })
  }
  next();
});

const authenticateJWT = async (req, res, next) => {
  try {

    const auth = req.header('Authorization');
    if (auth){
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decode.id);
      req.user = user;
    }
    next();

  } catch(error){
    next(error);
  }
};


//test
app.get('/callback', authenticateJWT, (req, res) => {
  try{
res.status(200).send('Callback success, Welcome ${user}');
  }catch(error){
    console.error(error);
    res.status(200).send('Callback failed');
  }

});



app.post('/entries', async (req, res, next) => {
  try{
    const {title, date, text} = req.body;
    const creatorId = req.user.id;
    if (req.user){
      const entry = await Entry.create({
        title,
        date,
        text,
        creatorId: creatorId
      })
      res.json(entry);
    } else {
      res.status(401).send('You must be logged in to create an entry');
    }
    const entries = await Entry.findAll();
    res.send(entries);

  }catch(error){
    console.error(error);
    next(error);

  }
});

//error handling middleware 
app.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if(res.statusCode < 400) res.status(500);
  res.send({error: error.message, name: error.name, message: error.message});
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  sequelize.sync()
    console.log(`Listening on port http://localhost:${port}/entries/home`)
});