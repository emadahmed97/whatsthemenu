const fs = require('fs');
const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const slug = require('slugs');

exports.moment = require('moment');


exports.dump = (obj) => JSON.stringify(obj, null, 2);


exports.staticMap = ([lng, lat]) => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${process.env.MAP_KEY}&markers=${lat},${lng}&scale=2`;


exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);
exports.logo = (name) => fs.readFileSync(`./public/images/icons/whatsthemenu.png`);
exports.faicon =(name) => name;

exports.storeName = (id) =>  Store.findOne({ _id: id}).name;


exports.siteName = `Whats the Menu`;

exports.menu = [
  { slug: '/stores', title: 'Stores', faicon: 'fa-shopping-cart fa-2x', },
  { slug: '/tags', title: 'Tags', faicon: 'fa-tag fa-2x', },
  { slug: '/topstores', title: 'Top Stores', faicon: 'fa-trophy fa-2x', },
  { slug: '/topitems', title: 'Top Items', faicon: 'fa-trophy fa-2x', },
  { slug: '/menuitems/add', title: 'Add Item', faicon: 'fa-plus fa-2x', },
  { slug: '/map', title: 'Map', faicon: 'fa-map fa-2x', },
];
