require('dotenv').config({ path: __dirname + '/../variables.env' });
const fs = require('fs');

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

const Store = require('../models/Store');
const ReviewStore = require('../models/ReviewStore');
const User = require('../models/User');


const stores = JSON.parse(fs.readFileSync(__dirname + '/stores.json', 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(__dirname + '/reviews.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync(__dirname + '/users.json', 'utf-8'));

async function deleteData() {
  await Store.remove();
  await ReviewStore.remove();
  await User.remove();
  process.exit();
}

async function loadData() {
  try {
    await Store.insertMany(stores);
    await ReviewStore.insertMany(reviews);
    await User.insertMany(users);
    console.log('Done!');
    process.exit();
  } catch(e) {
    console.log(e);
    process.exit();
  }
}
if (process.argv.includes('--delete')) {
  deleteData();
} else {
  loadData();
}
