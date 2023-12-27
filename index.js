const express = require('express')
const path = require('path')
const app = express()
const port = 8080
const { v4: uuidv4 } = require('uuid');
const contacts = require('./models/contacts.js');

//instantiate new users from the module contacts.js
let user1 = new contacts.User('xristos123', '12345');
let user2 = new contacts.User('alex123', '123456');
let user3 = new contacts.User('kostas123', '1234567');
let user4 = new contacts.User('john23', '12345678');
let user5 =new contacts.User('billy52', '123456789');

let userList = [user1,user2,user3,user4,user5]

//instantiate the list with the favourite ads for every user
let favAds = new Map();

userList.forEach(user => {
    favAds.set(user.username, []);
});

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
    let isAuthenticated = false;
    userList.forEach(user => {
        if (username === user.username && password === user.password) {
            const sessionId = uuidv4();
            user.sid = sessionId; // creates a new attribute 'sid' for the user
            const responseObject = {
            status: 200,
            message: 'User authenticated',
            sessionId: sessionId
            };
            res.status(200).json(responseObject);
            isAuthenticated = true;
        }
    })
    if (!isAuthenticated) {
        res.status(401).json({status: 401, message: 'Authentication failed'});
    }
})


app.post('/favourites', function(req, res){
    const {id, title, description, cost, image, username, sid} = req.body;
    console.log(id,title,description,cost,image, username, sid);
    let authenticated = false;
    let alreadyIn = false;
    for (let i = 0; i < userList.length; i++) {
        let user = userList[i];
        if (username === user.username && sid === user.sid){
            authenticated = true;
            favAds.get(username).forEach(ad =>{
                if(ad.id==id){
                    console.log("the ad is already in the list from an earlier session");
                    alreadyIn=true;
                }
            })

            if(alreadyIn==false){
                console.log("Added to favourites!");
                let adObj= new contacts.Ad(id, title, description, cost, image, username, sid);
                favAds.get(username).push(adObj);
                res.status(200).json({status: 200, message: 'Ad added to the favourites list'});
                favAds.get(username).forEach((value, index) => {
                    console.log(`  Value ${index + 1}: ${value.title}`);
                });
                break;
            }
        }
    }
    if (!authenticated) {
        res.status(401).json({status: 401, message: 'sid doesnt match the username'});
    }else{
        if(alreadyIn){
            res.status(409).json({status: 409, message: 'ad is already in favourites list'});
        }
    }
})







