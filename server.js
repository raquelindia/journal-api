const express = require('express');
const app = express();
const {sequelize} = require('./db');
const bodyParser = require('body-parser');
const seedData = require('./seed')
const journalRouter = require('./routes/journalRoutes');
const { auth } = require('express-openid-connect');
const { User } = require('./models/index');
const {Entry} = require('./models/index');
const {jwt} = require('jsonwebtoken');
const path = require('path');
const auth0 = require('auth0');
const { AuthenticationClient } = require('auth0');
const crypto = require('crypto');




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
  <p><b>Username: ${req.oidc.user.nickname}</b></p>
  <p>${req.oidc.user.email}</p>
  <img src="${req.oidc.user.picture}" alt="${req.oidc.user.name}">
  ` : 'Logged out');
});



app.get('/logout', (req, res) => {
  const returnTo = req.query.returnTo || '/authorize';
  res.redirect(returnTo);

})

app.get('/login', (req, res) => {

  const returnTo = req.query.returnTo || '/user-created';
  res.redirect(returnTo);
});

app.get('/user-created', async (req, res) => {
  const username = req.oidc.user.nickname;
  const name = req.oidc.user.name;
  const email =  req.oidc.user.email;

  if(req.oidc.isAuthenticated()) {

    const [user] = await User.findOrCreate({
      where: {
        username: username,
        name: name,
        email: email
      }
    });
    res.status(200).send(`Successfully created user: ${username}`);

  } else {
    res.status(500).send('Could not create user')
  }
 
});

const authenticateJWT = async (req, res, next) => {
  try {

    const auth = req.header('Authorization');
    if (auth){
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      req.oidc.user = user;
      console.log('jwt token success');
    }
    next();

  } catch(error){
    next(error);
  }
};


//test
app.get('/callback', authenticateJWT, (req, res) => {
  console.log('Received callback request');
  
  if (req.oidc.isAuthenticated()) {
    // Authenticated user, you can access user information via req.oidc.user
    console.log('Authenticated user:', req.oidc.user);
    const { sub, email, nickname } = req.oidc.user;
    // Handle authentication and authorization here
    // ...
    res.redirect('/home'); // Redirect to a secure route
  } else {
    // Handle authentication failure
    console.error('Authentication failed');
    res.status(401).json({ error: 'Authentication failed' });
  }
  
  })






//user can create a post 
app.post('/create/entries', async (req, res, next) => {
  try{
    const {title, date, text} = req.body;
    //const creatorId = req.user.id;
    const [user] = req.oidc.user;
    const [email] = req.oidc.user.email;

    if (req.oidc.isAuthenticated()){
      const foundUser = User.findOne({
        where: {
          email: email
         }
      });
      const createEntry = await Entry.create({
        title: title,
        date: date,
        text: text
      });
      const userAssociation = await User.findAll({ include: [{model: Entry, as: 'entries'}]});
      const entryAssociation = await Entry.findAll({include: [{model: User, as: 'user'}]});
      const loadedUser = await User.findOne({
        where: {
            id: user.id
        },
        include: Entry
       });
      // number of entries
       const numberOfEntries = loadedUser.entries.length;
       //index of newest entry
       const index = numberOfEntries - 1;
       //newest entry
       const newestEntry = loadedUser.entries[index];

       const entryTitle = createEntry.title;
       const entryDate = createEntry.date;
       const entryContent = createEntry.text;
      const userIndex = user.id - 1;
       const thisUser = userAssociation[userIndex];
       

       await thisUser.addEntry(newestEntry);

      res.status(200).send(`<h1>Successfully created entry number ${numberOfEntries}</h1>
      <h2>${entryTitle}</h2>
      <h3>${entryDate}</h3>
      <p>${entryContent}</p>
      `);
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

//user can read all their entries 
app.get('/user/entries', async (req, res, next) => {
  try {
    const [user] = req.oidc.user
    const userId = req.oidc.user.id;
    if(req.oidc.isAuthenticated()){
      const userEntries = await Entry.findAll({
        where: {
          userId: userId
        }
      });
      res.status(200).json(userEntries);
    } else {
      res.status(200).send('You have no journal entries');
    }
  }
   catch (error) {
    console.error(error);
    res.status(404).send('Cannot find user entries');
  }
});


//user can find one entry out of all their entries
app.get('/user/entries/:id', async (req, res) => {

  const [user] = req.oidc.user
  const id = req.params.id;
    const userId = req.oidc.user.id;
    try{
    if(req.oidc.isAuthenticated()){
      const userEntries = await Entry.findAll({
        where: {
          userId: userId
        }
      });

      const findEntry = await userEntries.findAll({
        where: {
          id
        }
      });
      res.status(200).json(findEntry);
    } else {
      res.status(200).send('You have no journal entries');
    }
  }
   catch (error) {
    console.error(error);
    res.status(404).send('Cannot find user entries');
  }
});


//user update entry
app.put('user/entry/update/:id', async (req, res) => {
  const [user] = req.oidc.user
  const id = req.params.id;
  const {title, date, text} = req.body;
    const userId = req.oidc.user.id;
    try{
    if(req.oidc.isAuthenticated()){
      const userEntries = await Entry.findAll({
        where: {
          userId: userId
        }
      });

      const findEntry = await userEntries.findAll({
        where: {
          id
        }
      });
      const updateThisEntry = await findEntry.update({
        title: title,
        date: date,
        text: text
      });

      res.status(200).send(`Updated entry ${findEntry.title}`);
    } else {
      res.status(200).send('You have no journal entries');
    }
  }
   catch (error) {
    console.error(error);
    res.status(404).send('Cannot find user entries');
  }
})

//user delete entry 
app.delete('user/entry/delete/:id', async (req, res) => {
  const [user] = req.oidc.user
  const id = req.params.id;
    const userId = req.oidc.user.id;
    try{
    if(req.oidc.isAuthenticated()){
      const userEntries = await Entry.findAll({
        where: {
          userId: userId
        }
      });

      const findEntry = await userEntries.findAll({
        where: {
          id
        }
      });
        const deleteThisEntry = await findEntry.destroy();

      res.status(200).send(`Deleted entry: ${findEntry.title}`);
    } else {
      res.status(200).send('You have no journal entries');
    }
  }
   catch (error) {
    console.error(error);
    res.status(404).send('Cannot find user entries');
  }
})




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