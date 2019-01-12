const express = require('express');
const app = express();

const Vimeo = require('vimeo').Vimeo;
const client = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.get('/api/video-info', (req,res) => {
  fetch(url)
    .then(response => {
      return response.json()
    .then(json => {
      return response.ok ? json : Promise.reject(json)
    });
  })
  .then((data) => {
    res.json(data);
  })
  .catch((error) => {
    console.log(error);
  })

})


app.listen('5000');
console.log('Listening on 5000');
