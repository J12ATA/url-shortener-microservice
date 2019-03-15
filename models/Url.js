const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UrlSchema = new Schema({ 
  url: { type: String, required: true },
  shortcut: { type: String, required: true }
});
const Url = mongoose.model('Url', UrlSchema);

module.exports.Url = Url;
