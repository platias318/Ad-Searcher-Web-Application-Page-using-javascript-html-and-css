const express = require('express')
const path = require('path')
const app = express()
const port = 8080
const { v4: uuidv4 } = require('uuid');
const contacts = require('./models/contacts.js');

let userDAO = new contacts.UserDAO();
let favouriteAds = new contacts.FavouritesDAO();

//instantiate new users from the module contacts.js
let user1 = new contacts.User('xristos123', '12345');
let user2 = new contacts.User('alex123', '123456');
let user3 = new contacts.User('kostas123', '1234567');
let user4 = new contacts.User('john23', '12345678');
let user5 =new contacts.User('billy52', '123456789');

userDAO.save(user1);
userDAO.save(user2);
userDAO.save(user3);
userDAO.save(user4);
userDAO.save(user5);


app.listen(port)

/* 
    Serve static content from directory "public",
    it will be accessible under path /, 
    e.g. http://localhost:8080/index.html
*/  
app.use(express.static('public'))

// parse url-encoded content from body
app.use(express.urlencoded({ extended: false }))

// parse application/json content from body
app.use(express.json())

// serve index.html as content root
app.get('/', function(req, res){

    var options = {
        root: path.join(__dirname, 'public')
    }

    res.sendFile('index.html', options, function(err){
        console.log(err)
    })
})

app.post('/login', function(req, res){
    const {username, password} = req.body;
    const user = userDAO.find(username, password);
    if(user !== null){ // the user is inside the list with the users
      const sessionId = uuidv4();
      userDAO.findByUsername(username).sid = sessionId;
      const responseObject = {
        status: 200,
        message: 'User authenticated',
        sessionId: sessionId
      };
      res.status(200).json(responseObject);
    }else{
      res.status(401).json({status: 401, message: 'Authentication failed'});
    }
  });


app.post('/favourites', function(req, res){
  const {id, title, description, cost, image, username, sid} = req.body;
  let authenticated = false;
  let alreadyIn = false;

  // Find the user by username
  let user = userDAO.findByUsername(username);
  if (user && user.sid === sid) {
    authenticated = true;

    // Check if the ad is already in the user's favourites
    let userFavourites = favouriteAds.findById(username);
    if (userFavourites) {
      alreadyIn = userFavourites.some(ad => ad.id === id);
    }

    if (!alreadyIn) {
      console.log("Added to favourites!");
      let adObj = new contacts.Ad(id, title, description, cost, image, username, sid);
      favouriteAds.save(username, adObj);
      res.status(200).json({status: 200, message: 'Ad added to the favourites list'});
    }
  }

  if (!authenticated) {
    res.status(401).json({status: 401, message: 'sid doesnt match the username'});
  } else if (alreadyIn) {
    res.status(409).json({status: 409, message: 'ad is already in favourites list'});
  }
});

app.get('/favouritesList', function(req,res){
  const username = req.query.username;
  const sessionId = req.query.sessionId;
  console.log(username);
  console.log(sessionId);
  // Find the user by username
  let user = userDAO.findByUsername(username);
  if (user && user.sid === sessionId) {
    console.log("found user");
    // Get the user's favourite ads
    let favouriteAdsList = favouriteAds.findById(username);
    if (favouriteAdsList) {
      console.log("found favourite ads");
      // If the user has favourite ads, return them
      res.status(200).json({status: 200, message: 'Favourite ads found', ads: favouriteAdsList});
    } else {
      // If the user doesn't have favourite ads, return an appropriate message
      res.status(404).json({status: 404, message: 'No favourite ads found'});
    }
  } else {
    // If the user is not authenticated, return an appropriate message
    res.status(401).json({status: 401, message: 'Authentication failed'});
  }
});