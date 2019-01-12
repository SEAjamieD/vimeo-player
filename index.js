const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.get('video-info', (req,res) => {
  
})


app.listen('5000');
console.log('Listening on 5000');
