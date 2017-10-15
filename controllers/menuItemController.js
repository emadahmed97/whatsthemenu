const mongoose = require('mongoose');
const MenuItem = mongoose.model('MenuItem');
const User = mongoose.model('User');
const Store = mongoose.model('Store');
const ReviewItem = mongoose.model('ReviewItem')
const slug = require('slugs');
const util = require('util');

exports.menuItemsList = async (req, res) => {
  const menuItems = await MenuItem.find();
  res.render('menuItemsList', {title: 'All Menu Items', menuItems});
};

exports.editMenuItem = async (req, res) => {
  const stores = await Store.find();
  res.render('editMenuItem', {title: 'Add a Menu Item', stores});
};

exports.getStoreBySlug = async (req, res, next) => {
    const store =  await Store.findOne({ slug: slug(req.body.store)});
    req.body.store = store;
    next();
};

exports.createMenuItem = async (req, res) => {
  req.body.author = req.user._id;
  const menuItem =  await(new MenuItem(req.body).save());
  if (!menuItem) {
    console.log('failed save');
    req.flash('failure', 'Menu item not created!');
    res.redirect('/');
    return;
  }
  req.flash('success', `Successfully Created ${menuItem.name}. Care to leave a review?`);
  res.redirect(`/menuItems/item/${menuItem.slug}`);
};

exports.getMenuItem = async (req,res) => {
  const menuItem = await MenuItem.findOne({slug: req.params.slug});
  const store =  await Store.findOne({ _id: menuItem.store});
  res.render('menuItem', {title: `${menuItem.name}`, menuItem, store});
};

exports.createReview = async (req, res) => {
  req.body.author = req.user._id;
  req.body.menuItem = req.params.id;
  const newReview = new ReviewItem(req.body);
  await newReview.save();
  req.flash('success', 'Review Saved!');
  res.redirect('back');
};

exports.getTopItems = async (req,res) => {
  const items = await MenuItem.getTopItems();
  res.render('topItems', {title:'Top Items', items});
};

exports.getStores = async (req, res) => {
  var menuItemPromise = await MenuItem.findOne({_id: req.params.id});
  var storePromise =  await Store.findOne({ _id: menuItemPromise.store});
  storePromise.menuSlug = menuItemPromise.slug;
  res.json(storePromise);
}

exports.heartItem = async (req, res) => {
  const heartsitem = req.user.heartsitem.map(obj => obj.toString());
  const operator = heartsitem.includes(req.params.id) ? '$pull' : '$addToSet'; // either adds it to the hearts or removes it
  const user = await User.findByIdAndUpdate(req.user._id,
    { [operator]: { heartsitem: req.params.id }}, // either pull or addToSet
    { new: true }
  );
  res.json(user);
};
