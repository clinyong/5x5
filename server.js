var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
var fs = require('fs');

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath
}));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const uploadsDir = path.resolve(__dirname, './uploads')
app.use(bodyParser.json());
app.post('/api/upload', function (req, res) {
  var now = new Date();
  var fileName = dateFormat(now, "yyyy-mm-dd-HH-MM-ss")
  fs.writeFileSync(`${uploadsDir}/${fileName}.json`,JSON.stringify(req.body, null, '\t'), 'utf8')
  res.send('Upload successfully.');
});

app.post('/api/download', function (req, res) {
  const uploads = fs.readdirSync(uploadsDir).filter(name => name != '.DS_Store')
  const latest = uploads[uploads.length - 1]
  const settings = fs.readFileSync(`${uploadsDir}/${latest}`).toString()
  res.setHeader('Content-Type', 'application/json')
  res.send(settings);
});

app.listen(3000, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:3000/');
});