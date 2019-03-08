'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mongooseConfig = require('./config/mongoose_config');
const urlValidator = require('./regex/urlValidator');
const Url = require('./models/Url').Url
const crypto = require('crypto');
const cors = require('cors');
const app = express(); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cors());

app.set('view engine', 'pug');

mongoose.connect(process.env.MONGO_URI, mongooseConfig);

const db = mongoose.connection;

db.on('error', err => console.error(`connection error:${err}`));

db.once('open', () => console.log('db connection successful'));

app.get('/', (req, res) => res.render('index'));

app.get('/api/hello', (req, res) => res.json({ greeting: 'hello API' }));

app.get('/api/shorturl/:_id', (req, res, next) => {
  const id = req.params._id;
  Url.findById(id, (err, doc) => {
    if (err) next(err);
    res.redirect(doc.url);
  });
});

app.post('/api/shorturl/new', (req, res, next) => {
  const userProvidedUrl = req.body.url;
  const randomId = crypto.randomBytes(3).toString('hex'); // random string
  const shortUrl = new Url({ url: userProvidedUrl, _id: randomId });
  if (userProvidedUrl.match(urlValidator)) { // user input vs validator
    Url.findOne({ url: userProvidedUrl.toLowerCase() }, (err, doc) => { // does url exist
      if (!doc) { // if no matching doc exists then
        shortUrl.save((err, doc) => { // create new doc
          if (err) next(err);
          res.status(201).json({url: doc.url, shortcut: doc._id}); // output new doc as json
        });
      } else { // if doc exists in our database
        if (err) next(err);
        res.status(201).json({url: doc.url, shortcut: doc._id}); // output existing doc as json
      }
    });
  } else { // user input failed url validation
    res.json({error: 'Invalid URL'}); // display error message
  }
});

app.use((req, res, next) => { // catch 404 and forward to error handler
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
})

app.use((err, req, res, next) => { // Error Handler
  res.status(err.status || 500);
  res.json({ error: { message: err.message } })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});