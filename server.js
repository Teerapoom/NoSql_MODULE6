const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
app.use(cors())
app.use(express.json());
app.get('/', (req, res) => {
res.send('Hello World! Let\'s Working with NoSQL Databases')
})
app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`)
})

const { MongoClient } = require("mongodb");
const uri = "mongodb://teerapoom:12345@localhost:27017/?authMechanism=DEFAULT&authSource=Module5";
const connectDB = async() => {
try {
const client = new MongoClient(uri);
await client.connect();
console.log(`MongoDB connected successfully.`);
} catch (err) {
console.log(err);
process.exit(1);
}
}
connectDB();

// Read All API
app.get('/Index', async(req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    const users = await client.db('Module5').collection('Index').find({}).sort({"Date received":-1}).limit(50).toArray();
    await client.close();
    res.status(200).send(users);
    })

    // Create API
app.post('/Index/create', async(req, res) => {
    const object = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('Module5').collection('Index').insertOne({
    key: object.VALUE
    });
    await client.close();
    res.status(200).send({
    "status": "ok",
    "message": "Object is created",
    "object": object
    });
    })

    // Update API
const { ObjectId } = require('mongodb')
app.put('/Index/update', async(req, res) => {
const object = req.body;
const id = object._id;
const client = new MongoClient(uri);
await client.connect();
await client.db('Module5').collection('Index').updateOne({'_id': ObjectId(id)
}, {"$set": {

key: object.VALUE
}});
await client.close();
res.status(200).send({
"status": "ok",
"message": "Object with ID = " + id + " is updated",
"object": object
});
})

// Delete API
app.delete('/Index/delete', async(req, res) => {
    const id = req.body._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('Module5').collection('Index').deleteOne({'_id': ObjectId(id)});
    await client.close();
    res.status(200).send({
    "status": "ok",
    "message": "Object with ID = " + id + " is deleted"
    });
    })

    // Read by id API
app.get('/Index/:id', async(req, res) => {
    const id = req.params.id;
    const client = new MongoClient(uri);
    await client.connect();
    const user = await client.db('Module5').collection('Index').findOne({"_id":
    ObjectId(id)
    });
    await client.close();
    res.status(200).send({
    "status": "ok",
    "message": "Complaint with ID = " + id + " is deleted"
    });
    })

    app.get('/Index/SUB_PATH/:searchText', async(req, res) => {
        const { params } = req;
        const searchText = params.searchText
        const client = new MongoClient(uri);
        await client.connect();
        const objects = await client.db('Module5').collection('Index').find({ $text: {
        
        $search: searchText } }).sort({ "FIELD": -1 }).limit(50).toArray();
        
        await client.close();
        res.status(200).send({
        "status": "ok",
        "searchText": searchText,
        "Complaint": objects
        });
        })

