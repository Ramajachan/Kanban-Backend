var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://Kanban-User:ZAQ%212wsx@kanban-arkwo.mongodb.net/test?retryWrites=true&w=majority";

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.use(express.static(__dirname + '/View'));

app.post('/add', async (req, res) => {
    client.connect(function(err, db) {
        if (err) throw err;
        var dbo = db.db("WorkersDB");
        var myobj = { 
            name: req.body.name,
            description: req.body.description,
            status: req.body.status
         };
        dbo.collection("Tasks").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
        res.redirect('/');
      });
});


app.use(bodyParser.urlencoded({ extended: true }));



app.use('/', router);
app.listen(process.env.port || 3000);


console.log('Running at Port 3000');


async function deleteTaskByName(client, nameOfTask){
    const result = await client.db("WorkersDB").collection("Tasks")
    .deleteOne({name: nameOfTask});
    console.log(`${result.deletedCount} jebanych taskow sie usunelo`);
}


async function updateTaskByName(client, nameOfTask, updatedTask){
    const result = await client.db("WorkersDB").collection("Tasks").updateOne(
        { name: nameOfTask},
        { $set: updatedTask}
     );

     console.log(`${result.matchedCount} document(s) matched the query criteria`);
     console.log(`${result.modifiedCount} document(s) updated`);
}


async function findTasksByStatus(client, { statusName }){
    const cursor = await client.db("WorkersDB").collection("Tasks").find({
        status: statusName
    })

    const results = await cursor.toArray();

    if(results.length > 0) {
        console.log(`Znaleziono`);
        results.forEach((result, i) => {
            console.log();
            console.log(`${i+1}. name: ${result.name}`);
            console.log(`_id: ${result._id}`);
            console.log(`description: ${result.description}`);
            console.log(`status: ${result.status}`);
        });
    }
}
 


async function findOneTaskByName(client, nameOfTask){
    const result = await client.db("WorkersDB").collection("Tasks").findOne({ name: nameOfTask });
    if(result) {
        console.log(`Znaneziono jebanego taska z jebana nazwa '${nameOfTask}':`);
        console.log(result);
    } else {
        console.log(`Nie znleziono jebanej nazwy: '${nameOfTask}'`);
    }
}

async function createMultipleTasks(client, newTasks){
    const result = await client.db("WorkersDB").collection("Tasks").insertMany(newTasks);
    console.log(`${result.insertedCount} nowe KURWA rekordy zostaly dodane z jebanymi ID:`);
    console.log(result.insertedIds);
};

function createTask(client, newTask){
    const result = client.db("WorkersDB").collection("Tasks").insertOne(newTask);
    console.log(`Jebane ID nowego taska: ${result.insertedId}`);
};
