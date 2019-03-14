const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UrlSchema = new Schema({ 
  _id: { type: String, default: mongoose.Types.ObjectId().toString().slice(0, 9) },
  url: { type: String, required: true }
});
const Url = mongoose.model('Url', UrlSchema);

module.exports.Url = Url;
