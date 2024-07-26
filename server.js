const express = require('express')
const { MongoClient } = require('mongodb');
const axios = require("axios");
const connectToDB = require('./db');
const fs = require('fs');
const csv = require('csv-parser')
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('/populate', async(req, res) =>{
  try {
    const db = await connectToDB();
    const jsonCollection = db.collection('jsonposts');
    const url1 = "https://jsonplaceholder.typicode.com/comments";
    const jsonResponse = await axios.get(url1);
    if (jsonResponse && jsonResponse.data.length) {
      const jsonResult = await jsonCollection.insertMany(jsonResponse.data);
      console.log("JSON insert result", jsonResult);
    }
    
    const fileLink = "http://cfte.mbwebportal.com/deepak/csvdata.csv";
    const csvResponse = await axios.get(fileLink, { responseType: 'stream' });
    const writeStream = fs.createWriteStream('./test.csv', { flags: 'w' });
    csvResponse.data.pipe(writeStream);
    writeStream.on('finish', () => {
      const csvCollection = db.collection('csvposts');
      const results = [];
      fs.createReadStream('./test.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          const csvResult = await csvCollection.insertMany(results);
          res.send('JSON data and CSV data fetched and saved to the database');
        });
    });
    writeStream.on('error', (error) => {
      res.status(500).send('An error occurred while writing the CSV file');
    });

  } catch (error) {
    res.status(500).send('An error occurred');
  }
})

app.post('/search', async(req, res) =>{
    try{
       const query = {};
       if(req.body.name){
        query.name = req.body.name;
       }
       if(req.body.email){
        query.email = req.body.email;
       }
       if(req.body.body){
        query.body = req.body.body;
       }
       const db = await connectToDB();
       const collection = db.collection('csvposts');
       const searchResult = await collection.find(query).toArray();
      res.status(200).json({data:searchResult});
    } catch (error) {
    console.error('Error performing database operations', error);
    }
})


app.listen(3000)