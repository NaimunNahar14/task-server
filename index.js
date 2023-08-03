const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rdjlwie.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const TaskCollection = client.db('TaskDB').collection('addedTask');
        // Send a ping to confirm a successful connection
        // added Task


        app.get('/task', async (req, res) => {
            const result = await TaskCollection.find({}).toArray();

            res.send(result);
        })

        app.post('/task', async (req, res) => {
            const add = req.body;
            console.log(add);
            const result = await TaskCollection.insertOne(add);
            res.send(result);

        });

        app.patch('/task/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const filter = { _id: new ObjectId(id) };
                const update = { $set: { status: req.body.status } };

                const options = { returnOriginal: false };
                const updatedTask = await TaskCollection.findOneAndUpdate(filter, update, options);

                if (!updatedTask.value) {
                    return res.status(404).json({ error: 'Task not found.' });
                }

                res.json({ message: 'Task updated successfully.', updatedTask: updatedTask.value });
            } catch (error) {
                console.error('Error updating task:', error);
                res.status(500).json({ error: 'An error occurred while updating the task.' });
            }
        });
        
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await TaskCollection.deleteOne(query);
            res.send(result);

        })

















        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('task is running')
})

app.listen(port, () => {
    console.log(`task is running on Port ${port}`);
})
