const express = require('express');
const cors = require('cors')
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express();
app.use(cors())
const port = 5000;

app.use(bodyParser.json());

app.post('/', (req, res) => {
    const { userInput } = req.body;
    // Process the data on the server (e.g., perform some operation)
    const processedData = `Processed: ${userInput}`;
    res.json({ result: processedData });
});

app.post('/fetch', async (req, res) => {
    const { purpose, sender, receiver, details } = req.body;

    try {
        // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint you want to use
        const apiUrl = 'https://api.getknit.ai/v1/router/run';

        // Replace 'YOUR_CUSTOM_HEADER' with the custom header you want to add
        const customHeader = process.env.API_KEY;

        const requestData = {
            "messages": [
                {
                    "role": "system",
                    "content": "Write an expressive, well structured and comprehensive email with the given variables."
                },
                {
                    "role": "user",
                    "content": "I {{sender}}, want to write an email for {{purpose}}- to {{receiver}}. Some additional details you can add include {{details}}  I would like the email to be written in three seperate paragraphs"
                }
            ],
            "model": {
                "name": "meta-llama/Llama-2-7b-chat-hf"
            },
            "variables": [
                {
                    "name": "sender",
                    "value": sender
                },
                {
                    "name": "purpose",
                    "value": purpose
                },
                {
                    "name": "receiver",
                    "value": receiver
                },
                {
                    "name": "details",
                    "value": details
                }
            ]
        }

        const headers = {
            // Add your custom header to the request headers
            'x-auth-token': customHeader,
        };

        // Make a POST request to the API with the provided data and headers
        const response = await axios.post(apiUrl, requestData, { headers });
        // const response = {
        //     data: "Aabra Ka Dabra"
        // }

        // Send the API response back to the client
        res.json(response.data)
        // res.json(req.body);
    } catch (error) {
        // Handle errors
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
