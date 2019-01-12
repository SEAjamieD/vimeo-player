require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.static('public'));

//set up vimeo client
const Vimeo = require('vimeo').Vimeo;
const client = new Vimeo(process.env.CLIENT_ID,
                         process.env.CLIENT_SECRET,
                         process.env.ACCESS_TOKEN);


// get info for single video
app.get('/api/videos/:id', (req,res) => {
  console.log('video-info hit')
  console.log(req.params.idUri);
  client.request({
    path: `videos/${req.params.id}`,
    query: {
      page: 1,
      per_page: 5,
      fields: 'uri,name,description,duration'
    }
  }, function(error, body, status_code, headers) {
    if (error) {
      console.log(error);
    } else {
      console.log(body);
      res.json(body);
    }
  })
})


// get videos from search
app.get('/api/search/:query', (req,res) => {
  console.log('search hit')
  console.log(req.params.query);

  client.request({
    path: `/videos`,
    query: {
      page: 1,
      per_page: 5,
      fields: 'uri,name,description,duration',
      query: req.params.query
    }
  }, function(error, body, status_code, headers) {
    if (error) {
      console.log(error);
    } else {
      console.log(body);
      res.json(body);
    }
  })

})


// home route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})


app.listen('5000');
console.log('Listening on 5000');
