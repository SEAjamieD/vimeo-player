const express = require('express');
const app = express();

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})


app.listen('5000');
console.log('Listening on 5000');
exports = module.exports = app;
