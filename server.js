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
app.use('/admin', journalRouter);


app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 
  `<h2>Welcome, ${req.oidc.user.name}</h2>
  <p><b>Username: ${req.oidc.user.nickname}</b></p>
  <p>${req.oidc.user.email}</p>
  <img src="${req.oidc.user.picture}" alt="${req.oidc.user.name}">
  ` : 'Logged out');
});


//Home
app.get("/home", async (request, response) => {
  try{
  response.status(200).send(`
  <h1>Welcome to Your Journal</h1>
  <h2>Log in <a href="https://journal-api-gu31.onrender.com/login">Here</a></h2>
  `);
  } catch(error){
      console.error(error)
      response.status(500).json("Internal Server Error");
  }
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
try{
  if(req.oidc.isAuthenticated()) {

    const [user] = await User.findAll({
      where: {
        username: username
      }
    });

    if(user.length > 0){
    res.status(200).send(`Welcome Back, ${user}!`);
    } else {
      const createUser = await User.create({
        username: username,
        name: name,
        email: email
      })
      const findNewUser = await User.findAll({
        where: {
          username: username
        }
      })
      const getUsername = findNewUser.username;
      res.status(200).send(`Welcome, ${getUsername}`);
    }

  } else {
    res.status(500).send('Could not create user');
  }
} catch (error){
  console.error(error);
  res.status(500).send('Internal Server Error');
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
    const [username] = req.oidc.user.nickname;

    if (req.oidc.isAuthenticated()){
      const createEntry = await Entry.create({
        title: title,
        date: date,
        text: text,
        creator: username
      });
      
      const findUserEntries = await Entry.findAll({
        where: {
          creator: username
        }
      });

      const findThisEntry = await findUserEntries.findOne({
        where: {
          title: title
        }
      })


      const numberOfEntries = findUserEntries.length;
      const entryTitle = findThisEntry.title;
      const entryDate = findThisEntry.date;
      const entryContent = findThisEntry.text;

      
      res.status(200).send(`<h1>Successfully created entry: ${numberOfEntries}</h1>
      <h2>${entryTitle}</h2>
      <h3>${entryDate}</h3>
      <p>${entryContent}</p>
      `);
    } else {
      res.status(403).send('You must be logged in to create an entry');
    }

  }catch(error){
    console.error(error);
    res.status(500).send('Internal Server Error');
    

  }
});

//user can read all their entries 
app.get('/entries', async (req, res, next) => {
  try {
    const username = req.oidc.user.nickname;
    if(req.oidc.isAuthenticated()){
      const userEntries = await Entry.findAll({
        where: {
          creator: username
        }
      });
      //check if entries exist
      if(userEntries.length > 0){ 
      res.status(200).json(userEntries);
      } else {
        res.status(200).send('You have no journal entries');
      }
    } else {
      res.status(403).send('Please log in');
    }
  }
   catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


//user can find one entry out of all their entries
app.get('/entries/:id', async (req, res) => {
  const id = req.params.id;
    const username = req.oidc.user.nickname;
    try{
    if(req.oidc.isAuthenticated()){
      const userEntry = await Entry.findOne({
        where: {
          id: id,
          creator: username
        }
      
      });
      //check if entry exists
      if(userEntry){
      res.status(200).json(userEntry);
      } else {
        res.status(404).send('Entry does not exist');
      }
    } else {
      res.status(403).send('Please log in');
    }
  }
   catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


//user update entry
app.put('/entry/update/:id', async (req, res) => {
  const id = req.params.id;
  const {title, date, text} = req.body;
    const username = req.oidc.user.nickname;
    try{
    if(req.oidc.isAuthenticated()){
      const userEntry = await Entry.findOne({
        where: {
          id: id,
          creator: username
        }
      });

      if (userEntry){
      const updateThisEntry = await userEntry.update({
        title: title,
        date: date,
        text: text
      });

      res.status(200).send(`Updated entry ${userEntry.title}`);
    } else {
      res.status(404).send('Entry does not exist');
    }
    } else {
      res.status(403).send('Please log in');
    }
  }
   catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})

//user delete entry 
app.delete('/entry/delete/:id', async (req, res) => {
  const id = req.params.id;
    const username = req.oidc.user.nickname;
    try{
    if(req.oidc.isAuthenticated()){
      const userEntry = await Entry.findOne({
        where: {
          id: id,
         creator: username
        }
      });
      //check if entry exists
        if(userEntry){

        const deleteThisEntry = await userEntry.destroy();

      res.status(200).send(`Deleted entry: ${userEntry.title}`);
        } else {
          res.status(404).send('Entry does not exist')
        }
    } else {
      res.status(200).send('You have no journal entries');
    }
  }
   catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})




//error handling middleware 
app.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if(res.statusCode < 400) res.status(500);
  res.send({error: error.message, name: error.name, message: error.message});
});

const port = process.env.PORT || 9000;

app.listen(port, () => {
  sequelize.sync()
    console.log(`Listening on port http://localhost:${port}/entries/home`)
});