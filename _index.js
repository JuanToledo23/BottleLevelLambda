const express = require('express');
const serverless = require('serverless-http');
const { Expo } = require('expo-server-sdk');
const { MongoClient } = require('mongodb');

const app = express();
const expo = new Expo();

const uri = "mongodb+srv://johntoledot:HARq056xJOvAeN2V@bottles.pojxxed.mongodb.net/";

const client = new MongoClient(uri);

app.use(express.json());

app.post('/send-notification', async (req, res) => {
    const { expoToken, message } = req.body;
    console.log('expoToken:', expoToken);
    if (!Expo.isExpoPushToken(expoToken)) {
        return res.status(400).send({ error: 'Invalid Expo Push Token' });
    }

    const pushMessage = {
        to: expoToken,
        sound: 'default',
        body: message,
        data: { anyData: 'you want to send' },
    };

    try {
        await expo.sendPushNotificationsAsync([pushMessage]);
        res.send({ success: true });
    } catch (error) {
        res.status(500).send({ error: 'Error sending notification' });
    }

    try {
        await client.connect();
        const myDB = client.db("bottlelevel");
        const myColl = myDB.collection("bottle");

        const doc = { name: message, low: true };
        const result = await myColl.insertOne(doc);
        console.log(
            `A document was inserted with the _id: ${result.insertedId}`,
        );
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
});

module.exports.handler = serverless(app);


// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
