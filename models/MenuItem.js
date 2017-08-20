const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: 'Store',
    required: 'You must supply a store!'
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  },
  photo: String
}, {
  toJSON: { virtuals: true },
  toObject: {virtuals: true},
});

menuItemSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slug(this.name);
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }
  next();
});

menuItemSchema.virtual('reviewItems', {
  ref: 'ReviewItem', // which model to link
  localField: '_id', // which field on the menuitem
  foreignField: 'menuItem' // which field on the review
});

function autopopulate(next) {
  this.populate('reviewItems');
  next();
}

menuItemSchema.statics.getTopItems = function() {
  return this.aggregate([
    { $lookup: {from: 'reviewitems', localField: '_id',
    foreignField: 'menuItem', as: 'reviews'}},
    { $match: {'reviews.0': { $exists: true} } },
    { $project: {
      photo: '$$ROOT.photo',
      name: '$$ROOT.name',
      reviews: '$$ROOT.reviews',
      slug: '$$ROOT.slug',
      store: '$$ROOT.store',
      averageRating: { $avg: '$reviews.rating' }
    }},
    {$lookup: {
      from: 'stores', // foreign model your looking up
      localField: 'store', // local field you will match to foriegn field
      foreignField: '_id', // foreign field you will match to local field
      as:'storeItem'
    }},
    { $sort: {averageRating: -1} },
    { $limit: 150}

  ]);
};

menuItemSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

menuItemSchema.pre('find', autopopulate);
menuItemSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('MenuItem', menuItemSchema);
