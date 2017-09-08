const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const MenuItem = mongoose.model('MenuItem');
const User = mongoose.model('User');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed!' }, false);
    }
  }
};

exports.homePage = (req, res) => {
  res.render('index', {title: 'Whats The Menu?'});
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if there is no file to resize
  if (!req.file) {
    next();
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;

  const photo = await jimp.read(req.file.buffer);
  await photo.resize(200, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);

  next();
};

exports.createStore = async (req, res) => {
  req.body.author = req.user._id;
  const store = await (new Store(req.body)).save();
  req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const page = req.params.page || 1;
  const limit = 6;
  const skip = (page * limit) - limit;
  const storesPromise = Store.getTopReviewStores().skip(skip).limit(limit);
  const countPromise = Store.count();
  const [stores, count] = await Promise.all([storesPromise, countPromise]);
  const pages = Math.ceil(count / limit);
  if (!stores.length && skip) {
    req.flash('info', 'Page does not exist. You have been redirected to the last page of stores ');
    res.redirect(`/stores/page/${pages}`);
    return;
  }
  const showMenuItems = true;
  res.render('stores', { title: 'Whats The Menu?', stores, page, pages, count, showMenuItems });
};

const confirmOwner = (store, user) => {
  if (!store.author.equals(user._id)) {
    throw Error('You must own a store in order to edit it!');
  }
};


exports.editStore = async (req, res) => {
  const store = await Store.findOne({ _id: req.params.id });

  confirmOwner(store, req.user);

  res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point';

  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store →</a>`);
  res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug }).populate('author reviews');
  if (!store) return next();
  const fulladdress = store.fulladdress ? store.fulladdress : null;
  res.render('store', { store, fulladdress,title: store.name, menuItem: store.menuItems });
};

exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true };

  const tagsPromise = Store.getTagsList();
  const itemsTagsPromise = MenuItem.getTagsList();
  const storesPromise = Store.find({ tags: tagQuery });
  const menuItems = MenuItem.find({ tags: tagQuery });
  const [tags,itemTags,stores, items] = await Promise.all([tagsPromise, itemsTagsPromise, storesPromise, menuItems]);


  res.render('tag', { tags, title: 'Tags', tag, stores, itemTags, items });
};

exports.searchStores = async (req, res) => {
  var pattern = `${req.query.q}`;
  const stores = await Store
  .find(
  { name: { $regex: pattern, $options: 'i' } })
  .limit(10);
  res.json(stores);
};

exports.mapStores = async(req,res) => {
  const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
  const q = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: 10000
      }
    }
  };
  const stores = await Store.find(q).select('slug name description location photo').limit(10);
  res.json(stores);
};

exports.mapPage = async(req,res) => {
  res.render('map', {title: 'Map'});
};

exports.heartStore = async (req, res) => {
  const hearts = req.user.hearts.map(obj => obj.toString());
  const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet'; // either adds it to the hearts or removes it
  const user = await User.findByIdAndUpdate(req.user._id,
    { [operator]: { hearts: req.params.id }}, // either pull or addToSet
    { new: true }
  );
  res.json(user);
};

exports.heartedStoresList = async (req, res) => {
  const stores = await Store.find({
    _id: { $in: req.user.hearts }
  });

  const items = await MenuItem.find({
    _id: { $in: req.user.heartsitem}
  });
  res.render('stores',{title: 'Liked Stores', stores, items} );
};

exports.getTopStores = async (req,res) => {
  const stores = await Store.getTopStores();
  res.render('topStores', {title:'Top Stores', stores});
}
