const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
//middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3eoxza1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const serviceCollection = client.db('assignment11').collection('services');
        const reviewCollection = client.db('assignment11').collection('reviews');
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        });
        //  review api
        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                };
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });
        // app.patch('/reviews/:id', async (req, res) => {
        //     const id = req.params.id;
        //    // const status = req.body.status;
        //    const review=req.body;
        //    const option={upsert:true};
        //     const query = { _id: ObjectId(id) };
        //     const updateDoc = {
        //         $set: {
        //             //status: status

        //         }
        //     }
        //     const result = await reviewCollection.updateOne(query, updateDoc,option);
        //     res.send(result);
        // });
        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = req.body;
            console.log(review);
            // const option = { upsert: true };
            // const updatedDoc = {
            //     $set: {
            //         service: review.service,
            //         serviceName: review.serviceName,
            //         price: review.price,
            //         customer: review.customer,
            //         email: review.email,
            //         status: review.status,
            //         phone: review.phone,
            //         message: review.message
            //     }
            // }
            // const result = await reviewCollection.updateOne(query, option);
            // res.send(result);
        });
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        });


    }
    finally {

    }
}
run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('food server is running');
});
app.listen(port, () => {
    console.log(`food server is running on the port${port}`);
})