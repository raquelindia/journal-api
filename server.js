require('dotenv').config('.env');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const app = express();
const {sequelize} = require('./db');
const seedData = require('./seed')
const journalRouter = require('./routes/journalRoutes');
const { auth } = require('express-openid-connect');
const { User } = require('./models');
const {jwt} = require('jsonwebtoken');

const port = 8000;

//middleware 
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


const AUTH0_SECRET = process.env;

//Auth0 config
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'new secret',
  baseUrl: 'https://localhost:8000',
  clientID: 'CubHsrEtxqi47dgrxuodpDatOUSzYkiY',
  issuerBaseUrl: 'https://dev-wmyn6dpovcmdzz3o.us.auth0.com'
};

//auth router attaches /login, /logout and /callback routes to the baseUrl
app.use(auth(config));


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

//check if user exists
app.use(async (request, response, next) => {
  try{
    const auth = req.header('Authorization');
    if(auth) {
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      req.user = user;
    }
    next();
  } catch(error){
    next(error);
  }
});






app.use('/entries', journalRouter);


app.listen(port, () => {
  sequelize.sync()
    console.log(`Listening on port https://localhost:${port}/entries/home`)
});