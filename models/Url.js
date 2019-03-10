const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UrlSchema = new Schema({ url: { type: String }});
const Url = mongoose.model('Url', UrlSchema);

module.exports.Url = Url;
