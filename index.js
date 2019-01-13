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
      res.json(body);
    }
  })
})


// get videos from search
app.get('/api/search/:query', (req,res) => {
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
      res.json(body);
    }
  })

})


// home route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Server listening on ${port}`);
