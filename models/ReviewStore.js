mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const reviewStoreSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: "You must supply an author!"
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: 'Store',
    required: 'You must supply a store!'
  },
  text: {
    type: String,
    required: 'Your review must have text'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
});

function autopopulate(next) {
  this.populate('author');
  next();
}

reviewStoreSchema.pre('find', autopopulate);
reviewStoreSchema.pre('findOne', autopopulate);


module.exports = mongoose.model('ReviewStore', reviewStoreSchema);
