var MongoClient = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var url = "mongodb+srv://Kanban-User:ZAQ%212wsx@kanban-arkwo.mongodb.net/test?retryWrites=true&w=majority";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
var assert = require('assert');
var exphbs  = require('express-handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
//const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });


app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

router.get('/', (req, res, next) => {
    res.render('index');
  });


router.post('/create', async (req, res) => {
    var myobj = { 
        name: req.body.name,
        description: req.body.description,
        status: req.body.status
     };
     MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, }, (err, db) => {
        assert.equal(null, err);
        var dbo = db.db("WorkersDB");
        dbo.collection("Tasks").insertOne(myobj, (err, res) => {
            assert.equal(null, err);
            console.log("Item inserted");
            db.close();
        });
        res.redirect('/');
      });
});

router.get('/read', async (req, res) => {
    var resultArray = [];
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, }, (err, db) => {
        assert.equal(null, err);
        var dbo = db.db("WorkersDB");
        var cursor = dbo.collection('Tasks').find();
        cursor.forEach((doc, err) => {
            assert.equal(null, err);
            resultArray.push(doc);
        },
        () => {
            db.close();
            res.render('index', {items: resultArray});
        });
    });
});

router.get('/update/:id', async (req, res) => {

})


router.get('/delete/:id', async (req, res) => {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, }, (err, db) => {
        assert.equal(null, err);
        var dbo = db.db("WorkersDB");
        dbo.collection("Tasks").deleteOne({ "_id": objectId(req.params.id)}, (err, result) => {
            assert.equal(null, err);
            console.log("Object with _id: "+req.params.id+" deleted successfully");
            db.close();
            res.redirect("/read");
        });
    });
});


app.use(bodyParser.urlencoded({ extended: true }));



app.use('/', router);
app.listen(process.env.port || 3000);


console.log('Running at Port 3000');

module.exports = router;