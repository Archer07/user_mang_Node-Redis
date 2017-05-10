const express = require('express');
const cons = require('consolidate');
const bodyParser = require('body-parser');
const path = require('path'); // nodeJs core module
const redis = require('redis');
const methodOverride = require('method-override');

const app = express();
// Port setting
const PORT = 3000;

let client = redis.createClient();


// Tempate engine settings
app.engine('html', cons.pug);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');


// Body parser middleware setting

app.use(bodyParser.urlencoded({extended:false}));

// Method Override setting.
// Lets you use HTTP verbs such as PUT and DELETE in places where the client doesn't support it
// override with POST having:  ?_method=DELETE
app.use(methodOverride('_method'));

// call routes after the previous processing
app.use(express.Router());


// connect to Redis server
client.on('connect', function() {
  console.log('Redis connected successfully!');
});

// Routes
/* Search page */
app.get('/', function (req, res, next) {
  res.render('main');
});

/* Search processing */

app.post('/users/search', function(req, res, next) {
  let id = req.body.id; // store the query data into the id variable
  // once we have the id we can start using Redis

  client.hgetall(id, function (err, hash) {
    // check if the object didn't return
    if (!hash) {
      res.render('main', {
        error: 'User doesn\'t exist!' // show error in case operation failed
      });
    } else {
      //obj.id = id; // if user does exist, store the input id to obj.id
       res.render('main', {
        obj: hash,
        message: 'User Has been retrived successfully!'
       });
    console.log(hash);
    }
  });

});




app.listen(PORT, function() {
  console.log('App is listening on port ' + PORT);
});
