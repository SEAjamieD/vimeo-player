require('dotenv').config();
const express = require('express');
const app = express();

// const proxy = require('http-proxy-middleware');
// const apiProxy = proxy('/api', { target: 'http://localhost:5000'});
// app.use('/api', proxy({ target: 'http://localhost:5000', changeOrigin: true }))

// testing
var cors = require('cors');
app.use(cors());




const Vimeo = require('vimeo').Vimeo;
const client = new Vimeo(process.env.CLIENT_ID,
                         process.env.CLIENT_SECRET,
                         process.env.ACCESS_TOKEN);

app.use(express.static('public'));



app.get('/api/video-info', (req,res) => {
  console.log('video-info hit')

  // client.request({
  //   path: '/channels/staffpics/videos',
  //   query: {
  //     page: 1,
  //     per_page: 5,
  //     fields: 'uri,name,description,duration'
  //   }
  // }, function(error, body, status_code, headers) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log(body);
  //     res.json(body);
  //   }
  // })

})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.listen('5000');
console.log('Listening on 5000');
