const express = require('express');
const app = express();
const {sequelize} = require('./db');
const bodyParser = require('body-parser');
const seedData = require('./seed')
const journalRouter = require('./routes/journalRoutes');
const { auth } = require('express-openid-connect');
const { User } = require('./models/User.js');
const {jwt} = require('jsonwebtoken');
const path = require('path');
const auth0 = require('auth0');
const { AuthenticationClient } = require('auth0');


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

// Express middleware for parsing JSON requests
app.use(bodyParser.json());



//Routes
app.use('/entries', journalRouter);


app.get('/home/callback', (request, response) => {
  auth0Client
  .exchangeCodeForAccessToken({ code: request.query.code})
  .then((authResult) => {
    const email = authResult.idTokenPayload.email;
      const name = authResult.idTokenPayload.name; 
      const username = authResult.idTokenPayload.nickname;
    if(request.oidc.user){
          const [user] = User.findOrCreate({
            where: {
              email: email },
              defaults: {
                username: username || 'Default Name',
                name: name || 'Default Name'
              },

            
          })
          .then(([user, created]) => {
            if (created){
              console.log('User was created:', user.toJSON());
            } else {
              console.log('User was found:', user.toJSON());
            }
            response.json({ message: 'Login with Google successful', user: authResult});
          })
          };

    response.json({ message: 'Login with Google successful', user: authResult });
  })

.catch((err) => {
  console.error('Error finding or creating user:', err);
  response.status(500).json({ message: 'Internal Server Error'});
});

});


app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  sequelize.sync()
    console.log(`Listening on port http://localhost:${port}/entries/home`)
});