const mongoose = require('mongoose');
const ReviewStore = mongoose.model('ReviewStore');

exports.addReview = async (req, res) => {
  req.body.author = req.user._id;
  req.body.store = req.params.id;
  const newReview = new ReviewStore(req.body);
  await newReview.save();
  req.flash('success', 'Review Saved!');
  res.redirect('back');
}
