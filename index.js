const express = require('express')
const path = require('path')
const app = express()
const port = 8080
const { v4: uuidv4 } = require('uuid');

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
    if (username === "admin" && password === "admin") {
        const sessionId = uuidv4();
        const responseObject = {
          status: 200,
          message: 'User authenticated',
          sessionId: sessionId
        };
        res.status(200).json(responseObject);
    } else {
        res.status(401).json({status: 401, message: 'Authentication failed'});
    }
})




